var React = require('react');

var InputBox = React.createClass({
    displayName: 'InputBox',

    getInitialState: function(){
        return {
            value: ''
        };
    },
    submit: function(e){
        e.preventDefault();
        this.props.onChange && this.props.onChange(this.state.value);
        if(this.props.clearOnSubmit)
            this.setState({
                value: ''
            });
        return false;
    },
    changeVal: function(e) {
        this.setState({
            value: e.target.value
        });
    },
    render: function() {
        return (
            <form onSubmit={this.submit}>
                { this.props.label ? <label>{this.props.label}</label> : null }
                <input onChange={this.changeVal} value={this.state.value} required="true"/>
                <button>{this.props.button || 'Save'}</button>
            </form>
        );
    }
});

module.exports = InputBox;