import * as React from 'react';
import { PureComponent, SFC } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Camera.css';

const backIcon = require('./back.svg');
const acceptIcon = require('./accept.svg');

enum CameraTakingState {
    requesting,
    failed,
    success,
    pictureTaken
}

interface State {
    setVideo: boolean;
    requestState: CameraTakingState;
    mediaStream?: MediaStream;
    pictureData?: string;
}

interface ActualCameraProps {
    requestState: CameraTakingState;
    pictureData?: string;
    onVideoRef(onVideoRef: HTMLVideoElement | null): void;
}

const ActualCamera: SFC<ActualCameraProps> = ({onVideoRef, requestState, pictureData}) => {
    switch (requestState) {
        case CameraTakingState.requesting: {
            return (
                <div>...</div>
            );
        }
        case CameraTakingState.pictureTaken:
        case CameraTakingState.success: {
            return (
                <video ref={onVideoRef} />
            );
        }
        case CameraTakingState.failed: {
            return (
                <div>:(</div>
            );
        }
        default: {
            return <div>impossible</div>;
        }
    }
};

interface Props {
    history: any;
    onImage(imageData: string): void;
}

const Camera = withRouter(class extends PureComponent<Props, State> {
    videoEl?: HTMLVideoElement;

    constructor(props: Props) {
        super(props);

        this.state = {
            requestState: CameraTakingState.requesting,
            setVideo: false
        };
    }

    componentWillMount() {
        navigator.mediaDevices.getUserMedia({audio: true, video: {facingMode: 'user'}})
            .then(stream => {
                this.setState({
                    mediaStream: stream,
                    requestState: CameraTakingState.success
                });
            })
            .catch(nope => (
                this.setState({
                    requestState: CameraTakingState.failed
                })
            ));
    }

    render() {
        const {requestState, mediaStream, setVideo, pictureData} = this.state;

        const onVideoRef = (videoEl: HTMLVideoElement) => {
            if (!videoEl || !mediaStream || setVideo) {
                return;
            }
            this.videoEl = videoEl;
            this.setState({
                setVideo: true
            });
            videoEl.srcObject = mediaStream;
            videoEl.play();
            videoEl.volume = 0;
        };

        const onPictureTake = () => {
            if (!this.videoEl) {
                return;
            }
            this.videoEl.pause();
            this.setState({
                requestState: CameraTakingState.pictureTaken
            });
        };

        const onRetake = () => {
            if (!this.videoEl) {
                return;
            }
            this.videoEl.play();
            this.setState({
                requestState: CameraTakingState.success
            });
        };

        const onFinish = () => {
            if (!this.videoEl) {
                throw new Error('What how?');
            }
            const {videoWidth: width, videoHeight: height} = this.videoEl;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d')!;
            context.drawImage(this.videoEl, 0, 0, width, height);

            const data = canvas.toDataURL('image/png');

            this.props.onImage(data);
            this.props.history.push('/art');
        };

        return (
            <div className="Camera">
                <ActualCamera
                    requestState={requestState}
                    onVideoRef={onVideoRef}
                    pictureData={pictureData}
                />
                <div className="my-bottom buttom-space-between">
                    {requestState === CameraTakingState.success && [
                        <Link key="back" className="back" to="/">
                            <img src={backIcon} className="back_icon"/>
                        </Link>,
                        <button key="takePicture" onClick={onPictureTake} className="button">
                            Take picture
                        </button>
                    ]}
                    {requestState === CameraTakingState.pictureTaken &&
                        [
                            <button key="retake" className = "back" onClick={onRetake}>
                                <img src={backIcon} className="back_icon"/>
                            </button>,
                            <button key="finish" className="back" onClick={onFinish}>
                                <img src={acceptIcon} className="back_icon"/>
                            </button>
                        ]}
                </div>
            </div>
        );
    }
});

export default Camera;