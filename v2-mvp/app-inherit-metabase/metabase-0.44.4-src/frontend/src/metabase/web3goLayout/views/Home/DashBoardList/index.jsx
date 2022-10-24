/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { IconDown } from '@arco-design/web-react/icon';
import { Button, Modal, Form, Input, Upload, Select, Checkbox, Table, TableColumnProps } from '@arco-design/web-react';
import { push } from "react-router-redux";
import "cropperjs/dist/cropper.css";
const Option = Select.Option;
const mapStateToProps = state => {
    return {
        isDark: state.app.isDark
    }
};
const mapDispatchToProps = {
    push
};
const FormItem = Form.Item;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterList: [{
                name: 'All'
            }, {
                name: 'Chain'
            }, {
                name: 'Product Design abcefghi'
            }, {
                name: 'Fundrasising'
            }],
            currentFilter: { name: 'All' },
            tableData: [],
            paramsShow: false,
            params: {
                createBy: '',
                myFavorite: false
            },
            createByList: [{ name: 1 }, { name: 2 }],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    render: (col, record, index) => (
                        <div className="name-col">
                            <img className="headicon" src={require("@/web3goLayout/assets/account/Avatar.png")} alt="" />
                            <div className="right">
                                <div className="title">Token Volume(Quick News)</div>
                                <div className="tag-list">
                                    <div className="item">Label</div>
                                    <div className="item">Product Design abcefg</div>
                                    <div className="item">Label</div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    title: 'Views',
                    dataIndex: 'salary',
                    sorter: (a, b) => a.email - b.email,
                },
                {
                    title: 'Favorites',
                    dataIndex: 'address',
                    sorter: (a, b) => a.email - b.email,
                },
                {
                    title: 'Shares',
                    dataIndex: 'email',
                    sorter: (a, b) => a.email - b.email,
                },
                {
                    title: '24h',
                    dataIndex: '24h',
                    filterIcon: <IconDown />,
                    filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
                        return (
                            <div className='arco-table-custom-filter'>
                                2235423
                            </div>
                        );
                    },
                    onFilter: (value, row) => {
                        return true
                    },
                    onFilterDropdownVisibleChange: (visible) => {
                        if (visible) {
                        }
                    },
                },
            ],
            data: [
                { key: 1 },
                { key: 2 },
                { key: 3 },
            ]
        }
    }
    changeFilter = (v) => {
        this.setState({
            currentFilter: v
        });
    }
    getList = () => {
        setTimeout(() => {
            this.tableData = [{}, {}];
        }, 1000);
    }

    render() {
        return (
            <div className="web3go-layout-home-dashbaoard-list">
                <div className="filter-wrap">
                    <div className="filter-btn" onClick={() => { this.setState({ paramsShow: !this.state.paramsShow }) }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5H13.5M11.5 11.5H4.71052M12.5 8H3.5" stroke="#6B7785" strokeWidth="1.5" />
                        </svg>
                        <span>Filters</span>
                    </div>
                    <div className="filter-list">
                        {
                            this.state.filterList.map((v, i) =>
                                <div
                                    className={"item" + (this.state.currentFilter.name == v.name ? ' active' : '')}
                                    onClick={() => { this.changeFilter(v) }}
                                    title={v.name}
                                    key={i}>{v.name}</div>
                            )
                        }
                    </div>
                </div>
                {
                    this.state.paramsShow ? (
                        <div className="search-params-wrap">
                            <div className="createby">
                                <div className="label">Created by</div>
                                <Select
                                    placeholder='Please select created by my following creators  '
                                    style={{ width: 386 }}
                                    allowClear
                                    onChange={(value) => {
                                        this.setState({
                                            params: {
                                                ...this.state.params,
                                                createBy: value
                                            }
                                        });
                                        this.getList();
                                    }
                                    }
                                >
                                    {this.state.createByList.map((v, i) => (
                                        <Option key={i} value={v.name}>
                                            {v.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <Checkbox>My favorite</Checkbox>
                        </div>
                    )
                        : null
                }
                {/* <div className="total-wrap">123 dashboards with selected label on Web3go</div> */}
                <Table borderCell={false} border={false} pagePosition='bottomCenter' columns={this.state.columns} data={this.state.data} />
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
