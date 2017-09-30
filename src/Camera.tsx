import * as React from 'react';
import { PureComponent, SFC } from 'react';
import './Camera.css';

enum RequestState {
    requesting,
    failed,
    success
}

interface State {
    mediaStream?: MediaStream;
    requestState: RequestState;
    setVideo: boolean;
}

interface ActualCameraProps {
    requestState: RequestState;
    onVideoRef(onVideoRef: HTMLVideoElement | null): void;
}

const ActualCamera: SFC<ActualCameraProps> = ({onVideoRef, requestState}) => {
    switch (requestState) {
        case RequestState.requesting: {
            return (
                <div>...</div>
            );
        }
        case RequestState.success: {
            return (
                <video ref={onVideoRef} />
            );
        }
        case RequestState.failed: {
            return (
                <div>:(</div>
            );
        }
        default: {
            return <div>impossible</div>;
        }
    }
}

class Camera extends PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            requestState: RequestState.requesting,
            setVideo: false
        };
    }

    componentWillMount() {
        navigator.mediaDevices.getUserMedia({audio: true, video: {facingMode: 'user'}})
            .then(stream => {
                this.setState({
                    mediaStream: stream,
                    requestState: RequestState.success
                });
            })
            .catch(nope => (
                this.setState({
                    requestState: RequestState.failed
                })
            ));
    }

    render() {
        const {requestState, mediaStream, setVideo} = this.state;

        const onVideoRef = (videoEl: HTMLVideoElement) => {
            if (!videoEl || !mediaStream || setVideo) {
                return;
            }
            this.setState({
                setVideo: true
            });
            videoEl.srcObject = mediaStream;
            videoEl.play();
        };

        return (
            <div className="Camera">
                <ActualCamera requestState={requestState} onVideoRef={onVideoRef} />
            </div>
        );
    }
}

export default Camera;