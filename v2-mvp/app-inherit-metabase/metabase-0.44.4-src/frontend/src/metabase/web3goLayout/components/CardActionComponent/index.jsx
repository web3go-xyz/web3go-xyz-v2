/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Message, Menu, Dropdown, } from '@arco-design/web-react';
import { push } from "react-router-redux";
import { IconDown, IconMoreVertical } from '@arco-design/web-react/icon';
import { position } from "tether";
import { LayoutLoginApi, LayoutDashboardApi } from '@/services'
import ChartInfoModal from "./ChartInfoModal";
import DownloadModal from "./DownloadModal";
import DuplicateModal from "./DuplicateModal";
import event from '@/web3goLayout/event';

const mapStateToProps = state => {
    return {
        isDark: state.app.isDark,
        currentUser: state.currentUser,
    }
};
const mapDispatchToProps = {
    push
};

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.ChartInfoModalRef = React.createRef();
        this.DuplicateModalRef = React.createRef();
        this.DownloadModalRef = React.createRef();
    }
    componentDidMount() {
    }
    init = (record) => {

    }
    clickDropdownIcon = (key) => {
        const { dashcardData, dashcard } = this.props;
        let cardData;
        if (!dashcardData[dashcard.id] || !dashcardData[dashcard.id][dashcard.card_id]) {
            cardData = {}
        } else {
            cardData = dashcardData[dashcard.id][dashcard.card_id].data;
        }
        if (key == 'Chart Info') {
            this.ChartInfoModalRef.init(description);
        } else if (key == 'Duplicate') {
            if (!this.props.currentUser) {
                event.emit('goSignIn');
                return;
            }
            debugger
            return;
            this.DuplicateModalRef.init({ ...cardData, card_id: dashcard.card_id });
        } else if (key == 'Download') {
            this.DownloadModalRef.init({ ...cardData, card_id: dashcard.card_id });
        }
    }
    render() {
        const { dashcardData, dashcard } = this.props;
        let cardData;
        if (!dashcardData[dashcard.id] || !dashcardData[dashcard.id][dashcard.card_id]) {
            cardData = {}
        } else {
            cardData = dashcardData[dashcard.id][dashcard.card_id].data;
        }
        let operationList = [
            //  {
            //   icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            //     <path d="M8 3.05L11.5875 4.25L8 5.45L4.4125 4.25L8 3.05ZM8 2L2 4V4.5L8 6.5L14 4.5V4L8 2ZM8 7.83731L5.5 7.02481L3 6.21231H2V6.9625L8 8.9625L14 6.9625V6.21231H13L8 7.83731ZM8 10.3557L3 8.73068H2V9.5L8 11.5L14 9.5V8.73068H13L8 10.3557ZM8 12.8593L3 11.2343H2L2 12L8 14L14 12V11.2343H13L8 12.8593Z" fill="#6B7785" />
            //   </svg>,
            //   name: 'Dataset'
            // },
            {
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.66666 2H12.6667C12.8435 2 13.013 2.07024 13.1381 2.19526C13.2631 2.32029 13.3333 2.48986 13.3333 2.66667V10" stroke="#6B7785" strokeWidth="1.33333" />
                    <path d="M2.66667 13.3333V5.33329C2.66667 5.15648 2.7369 4.98691 2.86193 4.86189C2.98695 4.73686 3.15652 4.66663 3.33333 4.66663H10C10.3683 4.66663 10.6667 4.96396 10.6667 5.33229V13.336C10.6668 13.4233 10.6496 13.5098 10.6161 13.5906C10.5827 13.6713 10.5336 13.7446 10.4718 13.8063C10.4099 13.868 10.3365 13.9168 10.2557 13.9501C10.1749 13.9833 10.0884 14.0003 10.001 14H3.332C3.24451 14 3.15789 13.9827 3.07708 13.9492C2.99627 13.9157 2.92286 13.8665 2.86106 13.8046C2.79927 13.7427 2.75029 13.6692 2.71693 13.5883C2.68357 13.5074 2.66649 13.4208 2.66667 13.3333V13.3333Z" stroke="#6B7785" strokeWidth="1.33333" />
                </svg>,
                name: 'Duplicate'
            },
        ]
        if (cardData.rows) {
            operationList.unshift({
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.024 7.35696L8.00066 10.3806L4.97666 7.35696M13.3333 11.6666V13.6666H2.66666V11.6666M8 1.66663V10.3333" stroke="#6B7785" strokeWidth="1.33333" />
                </svg>,
                name: 'Download'
            })
        }

        // if (description) {
        //     operationList.push({
        //         icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        //             <path d="M8 6.66667V11.3333M8 6V4.66667M14 8C14 11.3137 11.3137 14 8 14C4.68633 14 2 11.3137 2 8C2 4.68633 4.68633 2 8 2C11.3137 2 14 4.68633 14 8Z" stroke="#6B7785" strokeWidth="1.33" />
        //         </svg>,
        //         name: 'Chart Info'
        //     });
        // }
        if (location.pathname.includes('/layout/create')) {
            operationList.push({
                icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.6665 3.66668H3.49984M3.49984 3.66668V13.3333C3.49984 13.4217 3.53496 13.5065 3.59747 13.569C3.65998 13.6316 3.74477 13.6667 3.83317 13.6667H12.1665C12.2549 13.6667 12.3397 13.6316 12.4022 13.569C12.4647 13.5065 12.4998 13.4217 12.4998 13.3333V3.66668M3.49984 3.66668H5.33317M12.4998 3.66668H14.3332M12.4998 3.66668H10.6665M5.33317 3.66668V2.33334H10.6665V3.66668M5.33317 3.66668H10.6665M6.6665 6.00001V11M9.33317 6.00001V11" stroke="#6B7785" stroke-width="1.33333" />
                </svg>
                ,
                name: 'Remove'
            });
        }

        return (
            <div className="web3go-card-action-component">
                <div className="dropdown-wrap">
                    <Dropdown trigger='click' position="bottom" droplist={
                        <Menu className="web3go-layout-myspace-dashboardlist-menu" onClickMenuItem={(key) => { this.clickDropdownIcon(key) }}>
                            {operationList.map((v) => (
                                <Menu.Item key={v.name}>
                                    {v.icon}
                                    <span>
                                        {v.name}
                                    </span>
                                </Menu.Item>
                            ))}
                        </Menu>
                    }>
                        <div className="operation-wrap">
                            <IconMoreVertical></IconMoreVertical>
                        </div>
                    </Dropdown>
                </div>
                <ChartInfoModal onRef={(ref) => this.ChartInfoModalRef = ref} ></ChartInfoModal>
                <DuplicateModal onRef={(ref) => this.DuplicateModalRef = ref} ></DuplicateModal>
                <DownloadModal onRef={(ref) => this.DownloadModalRef = ref} ></DownloadModal>
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
