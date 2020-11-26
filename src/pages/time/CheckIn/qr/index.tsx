import React from "react";
import QrReader from 'react-qr-reader'
import FormCheck from "../form";

interface LocationState {
    qrResult: string | null;
    checkTime: Date
}

interface LocationProps {

}

export default class QRScane extends React.Component<LocationProps, LocationState> {
    constructor(props: LocationProps) {
        super(props);
        this.state = {
            qrResult: "",
            checkTime: new Date()
        }
    }

    handleScan = (data: string | null) => {
        if (data) {
            this.setState({
                qrResult: data,
                checkTime: new Date()
            })
        }
    }
    handleError = (err: any) => {
        console.error(err)
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
                    <p>{this.state.checkTime.toString()}</p>
                )}
                <FormCheck />
            </div>
        )
    }
}