/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Message, AutoComplete, Tabs, Typography, Tooltip, Select, Spin, Switch, Collapse, Notification } from '@arco-design/web-react';
import { IconSearch, IconSync, IconStar, IconCamera, IconInfoCircle } from '@arco-design/web-react/icon';
import { push, replace } from "react-router-redux";
import cx from "classnames";
import { LayoutDashboardApi, CardApi, MetabaseApi, defaultPublicCollectionId } from '@/services'
import event from '@/web3goLayout/event';
import { getMetadata } from "metabase/selectors/metadata";
import slugg from "slugg";
import * as query_builderActions from "@/query_builder/actions";
import * as Urls from "metabase/lib/urls";
import domtoimage from 'dom-to-image';
import { parse as parseUrl } from "url";

import { Link } from "react-router";
import { publicSpaceCollectionId, changePublicSpaceCollectionId } from "metabase/redux/app";
import LinkedDashboardModal from './LinkedDashboardModal';
import DatasetRightMain from "./DatasetRightMain";
import {
    getCard,
    getQuery,
    getQuestion,
    getMode,
    getParameterValues,
    getFirstQueryResult,
    getIsObjectDetail,
    getIsNativeEditorOpen,
    getIsResultDirty,
    getIsDirty,
    getRawSeries,
    getVisibleTimelineEvents,
    getSelectedTimelineEventIds,
} from "@/query_builder/selectors";
const CollapseItem = Collapse.Item;
const Option = Select.Option;
const mapStateToProps = state => {
    let databaseList = [];
    if (state.entities.databases) {
        databaseList = Object.keys(state.entities.databases).filter(v => v != -1337).map(v => state.entities.databases[v]);
    }
    return {
        ...state.qb.uiControls,
        metadata: getMetadata(state),
        isDirty: getIsDirty(state),
        timelineEvents: getVisibleTimelineEvents(state),
        selectedTimelineEventIds: getSelectedTimelineEventIds(state),
        rawSeries: getRawSeries(state),
        question: getQuestion(state),
        parameterValues: getParameterValues(state),
        card: getCard(state),
        query: getQuery(state),
        mode: getMode(state),
        result: getFirstQueryResult(state),
        isObjectDetail: getIsObjectDetail(state),
        isNativeEditorOpen: getIsNativeEditorOpen(state),
        isResultDirty: getIsResultDirty(state),
        currentUser: state.currentUser,
        isDark: state.app.isDark,
        userData: state.app.userData,
        databaseList,
        publicSpaceCollectionId: state.app.publicSpaceCollectionId,
    }
};
const mapDispatchToProps = {
    ...query_builderActions,
    push,
    replace,
    changePublicSpaceCollectionId
};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favouriteList: [],
            hideSideBar: false,
            tabIndex: '1',
            ifEditDatasetName: false,
            datasetName: 'New dataset',
            tagList: [],
            savedCurrentTagList: [],
            ifEditTag: false,
            addTagName: '',
            allTagList: [],
            searchKey: '',
            datasetList: [],
            usedDashboardList: [],
            rawDataList: [],
            savedAllTagList: [],
            saveBtnLoading: false,
            postBtnLoading: false,
            rawDataLoading: false,
            isEditing: true,
            alreadyInitRawData: false,
            alreadyInitEditData: false,
            options: ['Beijing', 'Shanghai', 'Guangzhou', 'Disabled'],
            originCardDetail: {},
            searchTags: [],
            searchCreateBy: '',
            mapDatabaseData: {},
        }
        this.datasetNameInputRef = React.createRef();
        this.tagInputRef = React.createRef();
        this.DatasetRightMainRef = React.createRef();
        this.LinkedDashboardModalRef = React.createRef();

    }
    async componentDidMount() {
        // 点击dataset后没关闭弹窗直接刷新，导致参数残留
        if (this.props.location.hash) {
            this.props.push({ pathname: '/redirect', state: { pathname: "/layout/create/dataset" } });
            return;
        }
        //测试用，加快速度
        this.props.changePublicSpaceCollectionId(defaultPublicCollectionId);
        // const collectionList = await CollectionsApi.list();
        // const publicSpaceCollection = collectionList.find(v => v.name == 'PublicSpace');
        // this.props.changePublicSpaceCollectionId(publicSpaceCollection.id);
        const slug = this.props.params.chartSlug;
        const currentDashboardId = Urls.extractEntityId(slug) || -1;
        this.setState({
            currentDashboardId
        });
        if (this.props.params.chartSlug) {
            this.getDashboardTags(currentDashboardId);
        }
        this.getAllTagList();
        this.getMyFavourites();
        this.getDatasetList();
    }
    componentDidUpdate(prevProp) {
        if (this.props.databaseList.length) {
            if (!this.state.alreadyInitRawData) {
                this.setState({
                    alreadyInitRawData: true
                });
            }
        }
        if ((prevProp.card !== this.props.card) && this.props.card && this.props.card.name) {
            if (!this.state.alreadyInitEditData) {
                if (this.props.card.query_type == "native") {
                    this.setState({ tabIndex: '2' });
                }
                this.setState({
                    datasetName: this.props.card.name,
                    alreadyInitEditData: true
                })
                this.getLinkedDashboards(this.props.card.id);
            }
        }
        if (!prevProp.card && this.props.card) {
            this.setState({
                originCardDetail: this.props.card
            });
        }
    }
    getLinkedDashboards = (cardId) => {
        LayoutDashboardApi.searchByDataset({
            "pageSize": 99999999,
            "pageIndex": 1,
            "datasetId": cardId,
        }).then(d => {
            this.setState({
                usedDashboardList: d.list
            });
        });
    }
    getAllRawData = async () => {
        this.setState({
            rawDataLoading: true
        });
        const { databaseList } = this.props;
        const databaserIdList = databaseList.map(v => v.id);
        const promiseArr = [];
        for (const v of databaserIdList) {
            promiseArr.push(MetabaseApi.db_schemas({ dbId: v }))
        }
        const schemasResult = await Promise.all(promiseArr);
        const promiseArr2 = [];
        for (const [i, v] of schemasResult.entries()) {
            for (const sv of v) {
                promiseArr2.push(MetabaseApi.db_schema_tables({ dbId: databaserIdList[i], schemaName: sv }))
            }
        }
        const tableResults = await Promise.all(promiseArr2);
        let rawDataList = [];
        tableResults.forEach(v => {
            rawDataList = [...rawDataList, ...v]
        })
        this.setState({
            rawDataList,
            rawDataLoading: false,
        });
    }
    changeSearchKey = (value) => {
        this.setState({
            searchKey: value
        })
    }
    getMyFavourites = () => {
        LayoutDashboardApi.listMyFavoritesDS({
            "pageSize": 9999999999,
            "pageIndex": 1,
            "orderBys": [],
            "accountId": this.props.userData.account.accountId,
            "searchName": ""
        }).then(d => {
            this.setState({
                favouriteList: d.list
            });
        });
    }
    getDatasetList = () => {
        this.setState({
            datasetLoading: true
        })
        // LayoutDashboardApi.getDataSets().then(d => {
        //     this.setState({
        //         datasetList: d,
        //         datasetLoading: false
        //     });
        // })
        LayoutDashboardApi.datasetList({
            "pageSize": 999999,
            "pageIndex": 1,
            "tagIds": this.state.searchTags,
            "creatorFilterBy": this.state.searchCreateBy,
            "datasetIds": this.state.showMyFavorite ? this.state.favouriteList.map(v => v.datasetId) : []
        }).then(d => {
            if (!d.list) {
                d.list = [];
                d.totalCount = 0;
            }
            this.setState({
                datasetList: d.list,
                datasetLoading: false
            });
        });

    }
    getDashboardTags = (currentDashboardId) => {
        LayoutDashboardApi.listDatasetTags(currentDashboardId)().then(d => {
            this.setState({
                tagList: d.map(v => v.tag_name),
                savedCurrentTagList: d
            });
        })
    }
    getAllTagList = () => {
        LayoutDashboardApi.listAllTagsDS().then(d => {
            this.setState({
                savedAllTagList: d,
                allTagList: d.map(v => v.tagName)
            });
        });
    }
    changeDataset = (value) => {
        this.setState({
            datasetName: value
        })
    }
    handleEditDatasetName = () => {
        this.setState({ ifEditDatasetName: true }, () => {
            this.datasetNameInputRef.current.focus();
        });
    }
    finishEditDatasetName = () => {
        this.setState({
            ifEditDatasetName: false
        })
    }
    handleEditTag = () => {
        this.setState({ ifEditTag: true, addTagName: '' }, () => {
            this.tagInputRef.current.focus();
        });
    }
    changeTagName = (value) => {
        this.setState({
            addTagName: value
        })
    }
    finishEditTag = () => {
        if (!this.state.addTagName) {
            this.setState({
                ifEditTag: false
            })
            return;
        }
        this.setState({
            tagList: [...this.state.tagList, this.state.addTagName],
            ifEditTag: false
        })
    }
    removeTag = (i) => {
        const tagList = [...this.state.tagList];
        tagList.splice(i, 1);
        this.setState({
            tagList,
        })
    }
    handleCancel = () => {
        this.props.replace('/layout/mySpace');
    }
    saveTag = (newDashbarodId) => {
        const { tagList, savedAllTagList, savedCurrentTagList } = this.state;
        let currentDashboardId = newDashbarodId || this.state.currentDashboardId;
        const removeTagList = [];
        const markTagList = [];
        tagList.forEach(v => {
            if (!savedCurrentTagList.find(sv => sv.tag_name == v)) {
                const find = savedAllTagList.find(sv => sv.tagName == v)
                if (find) {
                    markTagList.push(find);

                } else {
                    LayoutDashboardApi.AddTagDS({
                        "datasetId": currentDashboardId,
                        "tagName": v
                    })
                }
            }
        });
        savedCurrentTagList.forEach(v => {
            if (!tagList.includes(v.tag_name)) {
                removeTagList.push(v);
            }
        })
        if (markTagList.length) {
            LayoutDashboardApi.markTagsDS({
                "datasetId": currentDashboardId,
                "tagIds": markTagList.map(v => v.id)
            })
        }
        if (removeTagList.length) {
            LayoutDashboardApi.removeTagsDS({
                "datasetId": currentDashboardId,
                "tagIds": removeTagList.map(v => v.id)
            })
        }
    }
    uploadThumbnail = async (id, thumbnailBlob) => {
        const formData = new FormData();
        formData.append('file', thumbnailBlob);
        await LayoutDashboardApi.datasetPreviewUrl(id)(formData, { isUpload: true })
    }
    createThumbnail() {
        return new Promise((resolve) => {
            const el = document.getElementById('dataset-thumbnail');
            domtoimage.toBlob(el, {
                quality: 0.2,
                width: 1200,
                height: 630,
                bgcolor: 'rgb(250,251,252)',
            })
                .then((blob) => {
                    resolve(blob);
                }).catch(e => {
                    resolve(undefined)
                })
        });
    }
    handlePostDataset = (isDraft) => {
        if (this.state.saveBtnLoading || this.state.postBtnLoading) {
            return;
        }
        const loadingKey = isDraft ? 'saveBtnLoading' : 'postBtnLoading';
        // 改了名字，得先触发blur事件再保存
        setTimeout(async () => {
            this.setState({
                [loadingKey]: true
            });
            let thumbnailBlob;
            if (!isDraft) {
                thumbnailBlob = await this.createThumbnail();
            }
            event.emit('addChartSave', this.state.datasetName, async (cardId, card) => {
                this.saveTag(cardId);
                if (!isDraft) {
                    await this.props.createPublicLink({ id: cardId });
                    if (thumbnailBlob) {
                        await this.uploadThumbnail(cardId, thumbnailBlob);
                    }
                }
                await LayoutDashboardApi.externalEvent({
                    "topic": "dataset.changed",
                    "data": cardId
                })
                this.setState({
                    chartName: card.name
                });
                const slug = slugg(card.name);
                const suffix = slug ? `${cardId}-${slug}` : cardId;
                await this.DatasetRightMainRef.hideQueryBuilder();
                this.props.replace({ pathname: `/layout/create/dataset/${suffix}` });
                await this.DatasetRightMainRef.showQueryBuilder();
                this.setState({
                    [loadingKey]: false
                });
                const id = `${Date.now()}`;
                if (!sessionStorage.getItem('KeepGoingNotification')) {
                    sessionStorage.setItem('KeepGoingNotification', true);
                    Notification.success({
                        style: { width: 440 },
                        id,
                        title: isDraft ? 'Draft saved' : 'Posted',
                        duration: 5000,
                        content: (
                            <div>
                                <span>
                                    You can start building dashboard now.
                                </span>
                                <span className="hover-item" style={{ color: '#615CF6' }} onClick={() => {
                                    this.props.push({
                                        pathname: "/layout/create/dashboard",
                                        state: {
                                            selectDashboardToEdit: true,
                                        }
                                    })
                                    Notification.remove(id);
                                }}>&nbsp;Keep going -&gt;</span>
                            </div>
                        ),
                    })
                }
            }, () => {
                this.setState({
                    [loadingKey]: false
                });
            }, true);
        }, 0);
    }
    changeTab = async (key) => {
        if (key == 2) {
            const url = Urls.newQuestion({
                type: "native",
                creationType: "native_question",
            });
            const urlParsed = parseUrl(url);
            await this.props.replace({
                pathname: location.pathname,
                hash: urlParsed.hash
            })
        } else {
            await this.props.replace({
                pathname: location.pathname,
                hash: '',
            })
        }
        this.setState({ tabIndex: key });
    }
    clickRowDataItem = (v) => {
        this.DatasetRightMainRef.init(v);
        this.setState({
            datasetName: v.display_name
        });
    }
    clickDatasetItem = async (v) => {
        const cardData = await CardApi.get({
            cardId: v.id
        })
        this.DatasetRightMainRef.init({ db_id: cardData.database_id, id: `card__${v.id}` });
        this.setState({
            datasetName: v.name
        });
    }
    clickLinkedDashboard = () => {
        this.LinkedDashboardModalRef.init();
    }
    changeDatabaseCollapse = async (key, keys) => {
        if (keys.includes(key)) {
            const schemas = await MetabaseApi.db_schemas({ dbId: key })
            const promiseArr = [];
            for (const v of schemas) {
                promiseArr.push(MetabaseApi.db_schema_tables({ dbId: key, schemaName: v }))
            }
            const tableResults = await Promise.all(promiseArr);
            let rawDataList = [];
            tableResults.forEach(v => {
                rawDataList = [...rawDataList, ...v]
            })
            this.setState({
                mapDatabaseData: { ...this.state.mapDatabaseData, [key]: rawDataList }
            });
        }
    }
    get formatDatasetList() {
        const { datasetList, searchKey, searchCreateBy, searchTags } = this.state;
        return datasetList.filter(v => v.name.toLowerCase().includes(searchKey.toLowerCase()));
    }
    getFormatRowDataList(id) {
        const { mapDatabaseData, searchKey } = this.state;
        if (!mapDatabaseData[id]) {
            return [];
        }
        return mapDatabaseData[id].filter(v => v.display_name.toLowerCase().includes(searchKey.toLowerCase()));
    }
    render() {
        const { savedAllTagList, tagList, datasetName, ifEditDatasetName, ifEditTag, allTagList,
            isEditing, options, rawDataLoading, hideSideBar, tabIndex, originCardDetail, mapDatabaseData } = this.state;
        const ifEdit = this.props.card && (this.props.card.id || this.props.card.original_card_id)
        if (!this.props.publicSpaceCollectionId) {
            return <Spin style={
                {
                    display: 'block', minHeight: 100, display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }></Spin>;
        }
        return (
            <div className="web3go-dataset-create-page">
                <div className="p-top">
                    <div className="pt-left">
                        <div className="ptl-icon">
                            <img src={require("@/web3goLayout/assets/dashboardCreate/Dashboard-line1.png")} alt="" />
                        </div>
                        <div className="ptl-right">
                            <div className={cx("title", { edit: ifEditDatasetName })}>
                                <Input ref={this.datasetNameInputRef} className="input" type="text" value={datasetName} onChange={this.changeDataset} onBlur={this.finishEditDatasetName} onPressEnter={this.finishEditDatasetName} />
                                <span className="text">{datasetName}</span>
                                {ifEditDatasetName ?
                                    null :
                                    <img onClick={this.handleEditDatasetName} className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/edit.png")} alt="" />
                                }
                            </div>
                            <div className="tag-list">
                                {tagList.map((v, i) => (<div className="item" key={i}>
                                    <span>{v}</span>
                                    <img onClick={() => { this.removeTag(i) }} className="hover-item" src={require("@/web3goLayout/assets/dashboardCreate/close.png")} alt="" />
                                </div>))}
                                {
                                    ifEditTag ? (
                                        <div className="add-tag hover-item">
                                            <AutoComplete ref={this.tagInputRef} data={allTagList} className="input" type="text" onChange={this.changeTagName} onBlur={this.finishEditTag} onPressEnter={this.finishEditTag} ></AutoComplete>
                                            {/* <Input ref={this.tagInputRef} className="input" type="text" onChange={this.changeTagName} onBlur={this.finishEditTag} onPressEnter={this.finishEditTag} /> */}
                                        </div>
                                    ) : (
                                        <div className="add-tag hover-item" onClick={this.handleEditTag}>
                                            <img src={require("@/web3goLayout/assets/dashboardCreate/add.png")} alt="" />
                                            <span>Add tag</span>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                this.state.usedDashboardList.length > 0 ? (
                                    <div className="linked-datasets">
                                        <div onClick={this.clickLinkedDashboard} className="inner hover-primary">
                                            <span>
                                                Linked Dashboards:
                                            </span>
                                            <span className="number">
                                                {this.state.usedDashboardList.length}
                                            </span>
                                        </div>
                                    </div>
                                ) : null
                            }

                        </div>
                    </div>
                    {
                        !originCardDetail.public_uuid ? (
                            <div className="pt-right">
                                <Button className="btn" onClick={this.handleCancel}>Cancel</Button>
                                <Button className="btn" loading={this.state.saveBtnLoading} onClick={() => this.handlePostDataset(true)}>Save Draft</Button>
                                <Button className="btn" loading={this.state.postBtnLoading} onClick={() => this.handlePostDataset(false)} type="primary">Post</Button>
                            </div>
                        ) : (
                            <div className="pt-right">
                                <Button className="btn" onClick={this.handleCancel}>Cancel</Button>
                                <Button className="btn" loading={this.state.postBtnLoading} onClick={() => this.handlePostDataset(false)} type="primary">Save</Button>
                            </div>
                        )
                    }
                </div>
                <div className="tabs">
                    <Tabs activeTab={tabIndex} onChange={this.changeTab}>
                        <TabPane key='1' title='Data Editor' disabled={ifEdit && tabIndex == '2'}>
                        </TabPane>
                        <TabPane key='2' title='SQL' disabled={ifEdit && tabIndex == '1'}>
                        </TabPane>
                    </Tabs>
                </div>
                <div className={cx("p-main", { 's-hide': hideSideBar ? true : false })}>
                    <img onClick={() => { this.setState({ hideSideBar: !hideSideBar }) }} className="side-hide-icon hover-item" src={require("@/web3goLayout/assets/dashboardCreate/right_circle.png")} alt="" />
                    <div className={cx("side", tabIndex == '2' ? 'sql' : '')}>
                        <div className="scroll">
                            <div className="search-item">
                                <Input
                                    allowClear
                                    onChange={this.changeSearchKey}
                                    prefix={<IconSearch />}
                                    placeholder='Search dataset…'
                                />
                            </div>
                            <div className="search-item">
                                <Select
                                    allowClear
                                    placeholder='All dataset tags'
                                    mode="multiple"
                                    onChange={(value) => {
                                        this.setState({
                                            searchTags: value
                                        }, () => { this.getDatasetList() });
                                    }}
                                >
                                    {savedAllTagList.map((v, index) => (
                                        <Option key={v.id} value={v.id}>
                                            {v.tagName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="search-item">
                                <Select
                                    allowClear
                                    placeholder='Please select creators'
                                    onChange={(value) => {
                                        this.setState({
                                            searchCreateBy: value
                                        }, () => { this.getDatasetList() });
                                    }}
                                >
                                    <Option value="FOLLOWING">
                                        My following creators
                                    </Option>
                                    <Option value="ME">
                                        Created by myself
                                    </Option>
                                </Select>
                            </div>
                            <div className="search-item switch-wrap">
                                <span>My favorite</span>
                                <Switch onChange={(value) => {
                                    this.setState({
                                        showMyFavorite: value
                                    }, () => { this.getDatasetList() });
                                }} />
                            </div>
                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1']}
                            >
                                <CollapseItem header='Community datasets' name='1'>
                                    <div className="dataset-list">
                                        {this.formatDatasetList.map(v => (
                                            <Tooltip content={v.name} key={v.id}>
                                                <div className="item" onClick={() => { this.clickDatasetItem(v) }}>
                                                    <img className="dataset-icon" src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                                    <div className="text">{v.name}</div>
                                                    <img className="view-icon" src={require("@/web3goLayout/assets/dashboardCreate/view.png")} alt="" />
                                                </div>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </CollapseItem>
                                <CollapseItem header='Raw data' name='2'>
                                    <Collapse
                                        className="sub-collapse"
                                        bordered={false}
                                        onChange={this.changeDatabaseCollapse}
                                    >
                                        {
                                            this.props.databaseList.map(v => (
                                                <CollapseItem header={v.name} name={v.id} key={v.id}>
                                                    <Spin loading={!mapDatabaseData[v.id]} style={{ display: 'block', minHeight: 100 }}>
                                                        <div className="raw-data-list">
                                                            {this.getFormatRowDataList(v.id).map(v => (
                                                                <Tooltip content={v.name}>
                                                                    <div className="item" key={v.id} onClick={() => { this.clickRowDataItem(v) }}>
                                                                        <img className="dataset-icon" src={require("@/web3goLayout/assets/dashboardCreate/dataset.png")} alt="" />
                                                                        <div className="text">{v.display_name}</div>
                                                                        <img className="view-icon" src={require("@/web3goLayout/assets/dashboardCreate/view.png")} alt="" />
                                                                    </div>
                                                                </Tooltip>
                                                            ))}
                                                        </div>
                                                    </Spin>
                                                </CollapseItem>
                                            ))
                                        }

                                    </Collapse>
                                </CollapseItem>
                            </Collapse>
                        </div>
                    </div>
                    <div className="r-main">
                        <DatasetRightMain {...this.props} ifEdit={ifEdit} tabIndex={tabIndex} onRef={(ref) => this.DatasetRightMainRef = ref}></DatasetRightMain>
                    </div>
                </div>
                <LinkedDashboardModal {...this.props} usedDashboardList={this.state.usedDashboardList} onRef={(ref) => this.LinkedDashboardModalRef = ref} ></LinkedDashboardModal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
