import { CurrentUser } from "@/data/database";
import { ConnectState } from "@/models/connect";
import { QRcheck } from "@/services/checkin";
import { formatTime } from "@/utils/date";
import { Alert } from "antd";
import React from "react";
import QrReader from 'react-qr-reader'
import { connect, formatMessage } from "umi";
import FormCheck from "../form";

interface LocationState {
    qrResult: string | null;
    checkTime: number;
    errorMessage: string;
    alertType: 'success' | 'info' | 'warning' | 'error';
}

interface LocationProps {
    currentUser: CurrentUser;
}

class QRScane extends React.Component<LocationProps, LocationState> {
    constructor(props: LocationProps) {
        super(props);
        this.state = {
            qrResult: "",
            checkTime: 0,
            errorMessage: formatMessage({id: 'checkin.qr.scan-first'}),
            alertType: "info"
        }
    }

    handleScan = (data: string | null) => {
        if (data) {
            this.setState({
                qrResult: data,
                checkTime: new Date().getTime(), 
                errorMessage: ""
            })
        } else {
            this.setState({ errorMessage: formatMessage({id: 'checkin.qr.scan-fail'}), alertType: "warning"})
        }
    }
    handleError = (err: any) => {
        console.error(err)
        this.setState({ errorMessage: formatMessage({id: 'checkin.qr.init-fail'}), alertType: "error"})
    }

    handleSubmit = (shift: any, note: any) => {
        return QRcheck({checkTime: this.state.checkTime, shift: shift, note: note, ciphertext: this.state.qrResult})
    }

    resetForm = () => {
        this.setState({
            qrResult: "",
            checkTime: 0
        })
    }

    render() {
        return (
            <div>
                {this.state.qrResult == "" && (
                    <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                />
                )}
                {this.state.qrResult != "" && (
                    <Alert message="" description={`Check time: ${formatTime(this.state.checkTime)}`} type="info" />
                )}
                <FormCheck errorMessage={this.state.errorMessage} alertType={this.state.alertType} handleSubmit={this.handleSubmit} resetForm={this.resetForm}/>
            </div>
        )
    }
}

export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser
  }))(QRScane)