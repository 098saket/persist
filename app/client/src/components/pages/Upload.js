import React from 'react';
import * as uploadFile from '../../actions/uploadFile';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, Button, Input, InputGroup } from 'react-bootstrap';
import { Spinner } from '../helpers';
import Content from '../helpers/content';
import DropZoneUpload from '../helpers/dropzoneUpload';
import { SelectField, MenuItem } from 'material-ui';

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosen: false,
            url: null,
            name: null
        };

    }

    chooseData(event, index, value) {
        this.setState({
            name: event.target.innerText,
            chosen: true,
            url: value
        });
    }

    getUrl(fileTypes, name) {
        return fileTypes.find(fileType => fileType.name === name).url;
    }

    render() {
        const fileTypes = [
            {
                name: 'Student Data',
                url: '/upload/studentData'
            },
            {
                name: 'College Data',
                url: '/upload/collegeData'
            },
            {
                name: 'School Data',
                url: '/upload/schoolData'
            },
            {
                name: 'College Term Records',
                url: '/upload/termData'
            },
            {
                name: 'College Application Data',
                url: '/upload/applicationData'
            }
        ];

        const optionsHTML = fileTypes.map((type, i) => {
            return (
                <MenuItem key={ i }
                          name={ type.name }
                          value={ this.getUrl(fileTypes, type.name) }
                          primaryText={ type.name } />
            );
        });

        return (
            <Content title='Upload'>
                <p>
                    Which data would you like to upload?
                </p>
                <div>
                    <SelectField onChange={ this.chooseData.bind(this) } hintText='Select Data'
                                 value={ this.state.url }>
                        { optionsHTML }
                    </SelectField>
                </div>
                { this.state.chosen ? <DropZoneUpload url={ this.state.url } /> : null }
            </Content>
        );
    }
}

export default Upload;
