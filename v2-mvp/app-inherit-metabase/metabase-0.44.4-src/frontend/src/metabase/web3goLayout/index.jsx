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
                    link: "https://twitter.com/Analytix_Web3Go",
                    img: require("@/web3goLayout/assets/dashboard/Twitter.svg"),
                },
                {
                    link: "https://discord.gg/web3go",
                    img: require("@/web3goLayout/assets/dashboard/discord.svg"),
                },
                 {
                    link: "https://t.me/Web3GoCommunity",
                    img: require("@/web3goLayout/assets/dashboard/Telegram.svg"),
                },
                 {
                    link: "https://web3go.medium.com/",
                    img: require("@/web3goLayout/assets/dashboard/meduim.svg"),
                },
                 {
                    link: "https://www.youtube.com/channel/UCxUyipJO6O6LYNF-T7r-Kwg",
                    img: require("@/web3goLayout/assets/dashboard/YouTube.svg"),
                }, 
                {
                    link: "https://github.com/web3go-xyz",
                    img: require("@/web3goLayout/assets/dashboard/GitHub.svg"),
                },
                {
                    link: "https://web3go.gitbook.io/analytix/",
                    img: require("@/web3goLayout/assets/dashboard/Frame.svg"),
                }
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
                    <div className="fixed-right-menu">
                        {
                            this.state.fixedRightMenu.map((v, i) =>
                            (
                                <div key={i} className="item hover-item">
                                    <img onClick={() => this.jumpUrl(v.link)} src={v.img} alt="" />
                                    <div className="split"></div>
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
            {/* {showFooter ? <BaseFooter /> : null} */}
        </div >)

    }

}


export default connect(mapStateToProps)(Component);
