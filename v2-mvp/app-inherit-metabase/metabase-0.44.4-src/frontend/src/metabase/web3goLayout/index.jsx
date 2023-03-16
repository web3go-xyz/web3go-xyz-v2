/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import BaseHeader from './BaseHeader';
import BaseFooter from './BaseFooter';

const mapStateToProps = state => ({
    route: state.routing.locationBeforeTransitions,
});
class Component extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fixedRightMenu: [
                {
                    link: "https://twitter.com/Web3Go",
                    img: require("@/web3goLayout/assets/layout/Framef30.png"),
                },
                {
                    link: "https://discord.gg/NTrHSqyuRg",
                    img: require("@/web3goLayout/assets/layout/Framef28.png"),
                },
                {
                    link: "https://t.me/Web3GoCommunity",
                    img: require("@/web3goLayout/assets/layout/Framef29.png"),
                },
                {
                    link: "https://www.binance.com/en/feed/profile/23231592",
                    img: require("@/web3goLayout/assets/layout/live-icon-yellow2.png"),
                },
                {
                    link: "https://www.binance.com/en/live/u/40429244",
                    img: require("@/web3goLayout/assets/layout/live-icon-yellow1.png"),
                },
            ],
        }
    }
    componentDidMount() {
    }
    jumpUrl(url) {
        if (!url) {
            return;
        }
        window.open(url);
    }
    render() {
        const showFooter = this.props.route.pathname.includes('/layout/create') ? false : true;
        return (<div className="web3go-layout-page">
            {
                location.pathname.includes('/layout/create') ? null : (
                    <div class="fixed-right-menu">
                        {
                            this.state.fixedRightMenu.map((v, i) =>
                            (
                                <div key={i} className="item hover-item">
                                    <img onClick={() => this.jumpUrl(v.link)} src={v.img} alt="" />
                                    <div class="split"></div>
                                </div>
                            )
                            )
                        }
                    </div>
                )
            }
            <BaseHeader />
            <div className="container-content">
                <div className="content">
                    {this.props.children}
                </div>
            </div>
            {showFooter ? <BaseFooter /> : null}
        </div >)

    }

}


export default connect(mapStateToProps)(Component);
