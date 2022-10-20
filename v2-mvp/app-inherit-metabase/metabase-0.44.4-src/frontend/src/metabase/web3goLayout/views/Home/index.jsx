/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import './index.less';
import { Button, Modal, Form, Input, Upload, Carousel } from '@arco-design/web-react';
import { push } from "react-router-redux";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

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
            imageSrc: [
                require("@/web3goLayout/assets/home/banner.png"),
                require("@/web3goLayout/assets/home/banner.png"),
                require("@/web3goLayout/assets/home/banner.png"),
                require("@/web3goLayout/assets/home/banner.png"),
            ]
        }
    }

    render() {
        return (
            <div className="web3go-layout-home-page">
                <div className="banner-wrap">
                    <Carousel
                        style={{ height: 240 }}
                    >
                        {this.state.imageSrc.map((src, index) => (
                            <div key={index}>
                                <img
                                    src={src}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Component);
