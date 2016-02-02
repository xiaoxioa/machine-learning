/**
 * select_session.jsx: initial form.
 *
 * @SelectSession, must be capitalized in order for reactjs to render it as a
 *     component. Otherwise, the variable is rendered as a dom node.
 *
 * Note: this script implements jsx (reactjs) syntax.
 */

import ModelGenerate from './import/model_generate.jsx';
import ModelPredict from './import/model_predict.jsx';
import DataNew from './import/data_new.jsx';
import DataAppend from './import/data_append.jsx';
import DataUploadNew from './import/data_upload_new.jsx';
import DataUploadAppend from './import/data_upload_append.jsx';
import Submit from './import/submit.jsx';
import ResultDisplay from './import/result_display.jsx';

var SelectSession = React.createClass({
  // initial 'state properties'
    getInitialState: function() {
        return {
            value_session_type: '--Select--',
            ajax_done_result: null,
            ajax_done_error: null,
            ajax_fail_error: null,
            ajax_fail_status: null
        };
    },
  // update 'state properties'
    changeSessionType: function(event){
        this.setState({value_session_type: event.target.value});
        this.setState({submit: false});
        this.setState({send_data: false});
    },
  // update 'state properties' from children component (i.e. 'render_submit')
    displaySubmit: function(event) {
        this.setState({submit: event.render_submit});
    },
    sendData: function(event) {
        this.setState({send_data: event.created_submit_button});
    },
    handleSubmit: function(event) {console.log(this.refs.form);
      // prevent page reload
        event.preventDefault();

        var sessionType = this.state.value_session_type;
        if (sessionType == 'data_new' || sessionType == 'data_append') {
        // ajax arguments
            var ajaxEndpoint = '/load-data/';
            var ajaxArguments = {
                'endpoint': ajaxEndpoint,
                'data': new FormData(this.refs.svmForm),
                'contentType': false,
                'processData': false,
            };

          // asynchronous callback: ajax 'done' promise
           ajaxCaller(function (asynchObject) {
            // Append to DOM
                if (asynchObject && asynchObject.error) {
                    this.setState({ajax_done_error: asynchObject.error});
                } else if (asynchObject) {
                    this.setState({ajax_done_result: asynchObject});
                }
                else {
                    this.setState({ajax_done_result: null});
                }
            }.bind(this),
          // asynchronous callback: ajax 'fail' promise
            function (asynchStatus, asynchError) {
                if (asynchStatus) {
                    this.setState({ajax_fail_status: asynchStatus});
                    console.log('Error Status: ' + asynchStatus);
                }
                if (asynchError) {
                    this.setState({ajax_fail_error: asynchError});
                    console.log('Error Thrown: ' + asynchError);
                }
            }.bind(this),
          // pass ajax arguments
            ajaxArguments);
        }
    },
  // triggered when 'state properties' change
    render: function() {
        var SessionType = this.getSessionType(this.state.value_session_type);
        if (this.state.submit) {
            var SubmitButton = Submit;
        }
        else {
            var SubmitButton = 'span';
        }
        if (this.state.ajax_done_result) {
            var Result = ResultDisplay;
        }
        else {
            var Result = 'span';
        }

        return(
            {/* 'svmForm' attribute is used within 'handleSubmit' callback */}
            <form onSubmit={this.handleSubmit} ref='svmForm'>
                <fieldset className='fieldset-session-type'>
                    <legend>Session Type</legend>
                    <p>Choose a session type</p>
                    <select name='svm_session' autoComplete='off' onChange={this.changeSessionType} value={this.state.value_session_type}>
                        <option value='' defaultValue>--Select--</option>
                        <option value='data_new'>New Data</option>
                        <option value='data_append'>Append Data</option>
                        <option value='model_generate'>Generate Model</option>
                        <option value='model_predict'>Make Prediction</option>
                    </select>
                </fieldset>

                <SessionType onChange={this.displaySubmit} />
                <SubmitButton onChange={this.sendData} />
                <Result formResult={this.state.ajax_done_result} />
            </form>
        );
    },
  // call back: used for the above 'render' (return 'span' if undefined)
    getSessionType: function(type) {
        return {
            data_new: DataNew,
            data_append: DataAppend,
            model_generate: ModelGenerate,
            model_predict: ModelPredict
        }[type] || 'span';
    }
});

// render form
ReactDOM.render(<SelectSession/>, document.querySelector('.ml-container'));
