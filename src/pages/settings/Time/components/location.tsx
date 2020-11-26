import { ConnectState } from '@/models/connect';
import GoogleMapReact, { Coords } from 'google-map-react';
import React, { Component } from "react";
import { addLocation, getLocations } from '../service';
import { connect } from 'umi';
import { CurrentUser, LocationCheckIn } from '@/data/database';
import { Button, Card, Input, Modal, Slider, Spin } from 'antd';
import { DeleteOutlined, PushpinOutlined } from '@ant-design/icons';


interface LocationState {
    locations: Array<LocationCheckIn>;
    currentCoord: Coords;
    openSetRadius: boolean;
    zoom: number;
    radius: number;
    name: string;
    submitting: boolean;
}

interface LocationProps {
    currentUser: CurrentUser;
}

const marks = {
    0: '0',
    100: '100m',
    500: '500m',
    1000: '1000m',
    1500: '1500m',
    2000: {
      style: {
        color: '#f50',
      },
      label: <strong>2000m</strong>,
    },
  };

class LocationSetting extends Component<LocationProps, LocationState> {
    constructor(props: any) {
        super(props)
        this.state = {
            locations: [],
            zoom: 13,
            openSetRadius: false,
            radius: 100,
            submitting: false,
            currentCoord: {lat: 0, lng: 0},
            name: ""
        }

    }

    componentDidMount() {
        getLocations(this.props.currentUser.uid).then((locations) => {
            this.setState({locations: locations, currentCoord: locations[0].coord})
        })
    }

    clickHandler = (value: any) => {
        this.setState({openSetRadius: true, currentCoord: {lat: value.lat, lng: value.lng}})
        console.log(value)
    }

    submitHandler = () => {
        let newLocation = [{name: "", radius: this.state.radius, coord: this.state.currentCoord}, ...this.state.locations]
        this.setState({openSetRadius: false, locations: []})
        addLocation(this.props.currentUser.uid, newLocation).then((res) => {
            setTimeout(() => {
                this.setState({locations: newLocation})
            }, 500)
        }).catch((err) => {
            alert(err)
        })

    }

    handleApiLoaded = (map: any, maps: any) => {
        this.state.locations.map((mark) => {
            new google.maps.Circle({
                strokeOpacity: 0,
                fillColor: '#1aa086',
                fillOpacity: 0.5,
                map,
                center: mark.coord,
                radius: mark.radius})
        })
    };

    updateName = (index: number, name: string) => {
        let newLocation = this.state.locations
        newLocation[index].name = name
        addLocation(this.props.currentUser.uid, newLocation)
        this.setState({ locations: newLocation })
    }

    remove = (index: number) => {
        let newLocation = this.state.locations
        newLocation.splice(index, 1)
        this.setState({openSetRadius: false, locations: []})
        addLocation(this.props.currentUser.uid, newLocation)
        setTimeout(() => {
            this.setState({locations: newLocation})
        }, 500)
    }

    render() {
        return (
            <>
                <Spin spinning={this.state.locations.length == 0}>
                    <div style={{ height: '400px', width: '100%' }}>
                        {this.state.locations.length > 0 && (
                            <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyDjY9UCD3dsv7iDYNIzdToLKlz8Es1fG64'}}
                            center={this.state.currentCoord}
                            zoom={this.state.zoom}
                            onClick={this.clickHandler}
                            onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                            yesIWantToUseGoogleMapApiInternals={true}
                            onChange={(value) => this.setState({zoom: value.zoom}) }
                            >
                            </GoogleMapReact>
                        )}
                    </div>
                </Spin>

                <div style={{display: 'flex', marginTop: '20px'}}>
                    {this.state.locations.map((loc, index) => {
                        return (
                            <Card
                                style={{ width: 200, margin: '5px' }}
                                actions={[
                                    <PushpinOutlined onClick={() => this.setState({currentCoord: loc.coord})} key="pushpin" />,
                                    <DeleteOutlined onClick={() => this.remove(index)} key="delete" />
                                ]}
                            >
                                <Input defaultValue={loc.name || 'none'} onBlur={(value: any) => this.updateName(index, value.target.value)} />
                            </Card>
                        )
                    })}
                </div>

                <Modal
                    cancelText=""
                    closable={false}
                    title="Select Radius"
                    visible={this.state.openSetRadius}
                    footer={[
                        <Button key="submit" type="primary" loading={this.state.submitting} onClick={this.submitHandler}>
                          Save
                        </Button>,
                      ]}
                >
                    <Slider marks={marks} step={100} value={this.state.radius} min={0} max={2000}
                    onChange={(value: number) => this.setState({ radius: value })} />

                    <Input placeholder="name" value={this.state.name} onChange={(value: any) => this.setState({ name: value })} />
                </Modal>
            </>
        )
    }
}

export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser
  }))(LocationSetting)