import * as React from 'react';
import { PureComponent } from 'react';
import config from './config';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

interface Props {
    imageData: string;
}

interface State {
    loadingState: LoadingState;
    images?: string[];
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
            loadingState: LoadingState.LOADING
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
                return <div>Loading...</div>;
            case LoadingState.FAILURE:
                return <div>:(</div>;
            case LoadingState.SUCCESS:
                const {images} = this.state;
                if (!images) {
                    throw new Error('how?');
                }
                const items = images.map(i => {
                    return {
                        original: i,
                        thumbnail: i
                    };
                });
                return <ImageGallery items={items} slideInterval={1000} />;
            default:
                return <div>Blah</div>;
        }

    }
}