import React from 'react';
import GoogleMapReact, { Coords } from 'google-map-react';
import { PushpinOutlined } from '@ant-design/icons';
import FormCheck from '../form';
import { getLocations } from '@/pages/settings/Time/service';
import { connect, formatMessage } from 'umi';
import { ConnectState } from '@/models/connect';
import { User, LocationCheckIn } from '@/data/database';
import { getDistance } from '@/utils/maps';
import { localtionCheck } from '@/services/checkin';

interface LocationState {
    center: Coords;
    zoom: number;
    locations: Array<LocationCheckIn>;
    errorMessage: string;
    alertType: 'success' | 'info' | 'warning' | 'error';
}

interface LocationProps {
    currentUser: User
}

const AnyReactComponent = (lat: any, lng: any) => <PushpinOutlined rotate={90} style={{ fontSize: '24px', color: 'red' }} />;

class LocationCheck extends React.Component<LocationProps, LocationState> {

    constructor(props: LocationProps) {
        super(props);
        this.state = {
            center: {lat: -1, lng: 0},
            zoom: 15,
            locations: [],
            errorMessage: "",
            alertType: "info"
        }
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              this.setState({center: pos})

              getLocations(this.props.currentUser.parent).then((locations:  Array<LocationCheckIn>) => {
                let isOk = locations.some(loc => getDistance(loc.coord, pos) <= loc.radius)
                if (!isOk) {
                    this.setState({errorMessage: formatMessage({id: 'checkin.location.out-range'}), alertType: "error"})
                }
                this.setState({ locations: locations})
            })
          })
        } else {

        }
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

    handleSubmit = (shift: any, note: any) => {
        return localtionCheck({...this.state.center, shift: shift, note: note, checkTime: new Date().getTime()})
    }

    resetForm = () => {
    }

    render(){
        return (
            <div style={{ height: '300px', width: '100%' }}>
                <p>You Are Here</p>
                {this.state.center.lat >=0 && this.state.locations.length > 0 && (
                    <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyDjY9UCD3dsv7iDYNIzdToLKlz8Es1fG64'}}
                    defaultCenter={this.state.center}
                    onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                    defaultZoom={this.state.zoom}
                    >
                        <AnyReactComponent
                        lat={this.state.center.lat}
                        lng={this.state.center.lng}
                        />
                    </GoogleMapReact>
                )}
                <FormCheck errorMessage={this.state.errorMessage} alertType={this.state.alertType} handleSubmit={this.handleSubmit} resetForm={this.resetForm}/>
            </div>
        )
    }
}

export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser
  }))(LocationCheck)
