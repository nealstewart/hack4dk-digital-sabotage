import * as React from 'react';
import { PureComponent, SFC } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Camera.css';

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
    pictureData?: string[];
}

interface ActualCameraProps {
    requestState: CameraTakingState;
    pictureData?: string[];
    onVideoRef(onVideoRef: HTMLVideoElement | null): void;
}

const captureImage = (videoEl: HTMLVideoElement) => {
    const {videoWidth: width, videoHeight: height} = videoEl;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;
    context.drawImage(videoEl, 0, 0, width, height);

    return canvas.toDataURL('image/png');
};

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

const EXPOSURE_LENGTH = 5000;
const EXPOSURE_RATE = EXPOSURE_LENGTH / 10;

interface Props {
    history: any;
    onImage(imageData: string[]): void;
}

const Camera = withRouter(class extends PureComponent<Props, State> {
    videoEl?: HTMLVideoElement;
    intervalId: any;
    initialTime: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            requestState: CameraTakingState.requesting,
            setVideo: false
        };

        this.intervalId = 0;
        this.initialTime = 0;
    }

    startInterval() {
        this.setState({pictureData: []});
        this.initialTime = Date.now();
        const onInterval = () => {
            this.state.pictureData!.push(captureImage(this.videoEl!));
            if ((Date.now() - this.initialTime) > EXPOSURE_LENGTH) {
                this.stopRecording();
                return;
            }
        };

        this.intervalId = setInterval(onInterval, EXPOSURE_RATE);
    }

    stopRecording() {
        this.videoEl!.pause();
        clearInterval(this.intervalId);
        this.setState({
            requestState: CameraTakingState.pictureTaken
        });
    }

    componentWillMount() {
        navigator.mediaDevices.getUserMedia({audio: true, video: {facingMode: 'user'}})
            .then(stream => {
                this.startInterval();
                this.setState({
                    mediaStream: stream,
                    requestState: CameraTakingState.success,
                    pictureData: []
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
            this.stopRecording();
        };

        const onRetake = () => {
            if (!this.videoEl) {
                return;
            }
            this.videoEl.play();
            this.setState({requestState: CameraTakingState.success});
            this.startInterval();
        };

        const onFinish = () => {
            if (!this.videoEl) {
                throw new Error('What how?');
            }

            this.props.onImage(this.state.pictureData!);
            this.props.history.push('/art');
        };

        return (
            <div className="Camera">
                <ActualCamera
                    requestState={requestState}
                    onVideoRef={onVideoRef}
                    pictureData={pictureData}
                />
                <div className="my-bottom">
                    {requestState === CameraTakingState.success && [
                        <Link key="back" className="left button" to="/">Back</Link>,
                        <button key="takePicture" onClick={onPictureTake} className="button">
                            Take picture
                        </button>
                    ]}
                    {requestState === CameraTakingState.pictureTaken &&
                        [
                            <button key="retake" className="button" onClick={onRetake}>
                                Retake
                            </button>,
                            <button key="finish" className="button" onClick={onFinish}>
                                Finish
                            </button>
                        ]}
                </div>
            </div>
        );
    }
});

export default Camera;