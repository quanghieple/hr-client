import React from 'react';
import GoogleMapReact, { Coords } from 'google-map-react';
import { PushpinOutlined } from '@ant-design/icons';
import FormCheck from '../form';

interface LocationState {
    center: Coords;
    zoom: number;
}

interface LocationProps {

}

const AnyReactComponent = (lat: any, lng: any) => <PushpinOutlined rotate={90} style={{ fontSize: '24px', color: 'red' }} />;

export default class LocationCheck extends React.Component<LocationProps, LocationState> {

    constructor(props: LocationProps) {
        super(props);
        this.state = {
            center: {lat: -1, lng: 0},
            zoom: 15
        }
    }

    handleError(evt: any) {
        if (evt.message) { // Chrome sometimes provides this
          alert("error: "+evt.message +" at linenumber: "+evt.lineno+" of file: "+evt.filename);
        } else {
          alert("error: "+evt.type+" from element: "+(evt.srcElement || evt.target));
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
          })
        }
        window.addEventListener("error", this.handleError, true);
    }

    render(){
        return (
            <div style={{ height: '300px', width: '100%' }}>
                <p>You Are Here</p>
                {this.state.center.lat >=0 && (
                    <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyDjY9UCD3dsv7iDYNIzdToLKlz8Es1fG64'}}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                    >
                        <AnyReactComponent 
                        lat={this.state.center.lat}
                        lng={this.state.center.lng}
                        />
                    </GoogleMapReact>
                )}
                <FormCheck />
            </div>
        )
    }
}