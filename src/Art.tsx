import * as React from 'react';
import { PureComponent } from 'react';
import config from './config';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Link } from 'react-router-dom';

interface Props {
    imageData: string;
}

interface State {
    loadingState: LoadingState;
    images?: string[];
    selected: number;
}

enum LoadingState {
    LOADING,
    SUCCESS,
    FAILURE
}

export default class Art extends PureComponent<Props, State> {
    constructor() {
        super();
        this.state = {
            loadingState: LoadingState.LOADING,
            selected: 0
        };
    }

    componentWillMount() {
        fetch(config.getUrl() + '/art')
            .then(a => a.json())
            .then(images => this.setState({
                loadingState: LoadingState.SUCCESS,
                images
            }))
            .catch(() => this.setState({loadingState: LoadingState.FAILURE}));
    }

    render() {
        switch (this.state.loadingState) {
            case LoadingState.LOADING:
                return (
                    <div>
                        <div>Loading...</div>
                        <div className="my-bottom">
                            <Link to="/camera">Back</Link>
                        </div>
                    </div>
                );
            case LoadingState.FAILURE:
                return <div>:(</div>;
            case LoadingState.SUCCESS:
                const {images} = this.state;
                if (!images) {
                    throw new Error('how?');
                }
                const items = images.map(i => ({
                        original: config.appendPath(i),
                        thumbnail: config.appendPath(i)
                }));

                const {imageData} = this.props;

                const onSelect = () => {
                    const imageUrl = this.state.images![this.state.selected];
                    fetch(config.appendPath('graffiti') + '?art=' + encodeURIComponent(imageUrl) + '&location=12,55', {
                        method: 'POST',
                        headers: {},
                        body: imageData
                    }).then(a => console.log(a));
                };

                return (
                    <div>
                        <ImageGallery
                            onSlide={(i: number) => this.setState({selected: i})}
                            items={items}
                            slideInterval={1000}
                            showThumbnails={false}
                            showFullscreenButton={false}
                            showPlayButton={false}
                        />
                        <div className="my-bottom">
                            <Link to="/camera">Back</Link>
                            <button onClick={onSelect}>Select</button>
                        </div>
                    </div>
                );
            default:
                return <div>Blah</div>;
        }

    }
}