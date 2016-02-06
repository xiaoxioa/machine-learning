/**
 * supply_predictors.jss: generate correct number of input elements, based on
 *     the number of generalized features, that can be expected for the
 *     selected dataset. When values are entered in the input element, a
 *     prediction can be estimated, and returned to the front-end.
 *
 * Note: this script implements jsx (reactjs) syntax.
 */

var SupplyPredictors = React.createClass({
  // initial 'state properties'
    getInitialState: function() {
        return {
            ajax_done_options: null,
            ajax_done_error: null,
            ajax_fail_error: null,
            ajax_fail_status: null
        };
    },
  // update 'state properties': allow parent component(s) to access properties
    validIntegerEntered: function(event){
        {/* get array of input elements, by classname */}
        var predictionNodeList = document.getElementsByClassName('predictionInput');

        {/* if input value is empty, store 'false' within corresponding array */}
        var submitArray = Array.prototype.map.call(predictionNodeList, function(element) {
            if (!element.value) {
                return false;
            }
            else {
                return true;
            }
        });

        {/* check if every element is 'true' */}
        var submitBoolean = submitArray.every(function(element) {
            return element == true;
        });

        if (submitBoolean) {
            this.props.onChange({submitted_proper_predictor: true});
        }
        else {
            this.props.onChange({submitted_proper_predictor: false});
        }
    },
  // triggered when 'state properties' change
    render: function(){
        var options = JSON.parse(this.state.ajax_done_options);

        return(
            <fieldset className='fieldset-prediction-input'>
                <legend>Prediction Input</legend>

                {/* array components require unique 'key' value */}
                {options && options.map(function(value, index){ 
                    return <input type='text' name='prediction_input[]' className='predictionInput' placeholder={value} key={index} onChange={this.validIntegerEntered} value={this.state['value_predictor_' + index.toString()]} />;
                }.bind(this))}

            </fieldset>
        );
    },
  // call back: get session id(s) from server side, and append to form
    componentDidMount: function () {
      // ajax arguments
        var ajaxEndpoint = '/retrieve-feature-properties/';
        var ajaxData = {'session_id': this.props.selectedModelId};
        var ajaxArguments = {
            'endpoint': ajaxEndpoint,
            'data': ajaxData
        };

      // asynchronous callback: ajax 'done' promise
        ajaxCaller(function (asynchObject) {
        // Append to DOM
            if (asynchObject && asynchObject.error) {
                this.setState({ajax_done_error: asynchObject.error});
            } else if (asynchObject) {
                this.setState({ajax_done_options: asynchObject});
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
});

// indicate which class can be exported, and instantiated via 'require'
export default SupplyPredictors
