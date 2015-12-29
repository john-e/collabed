var React = require('react'),
    jsDiff = require('diff-match-patch'),
    jsDiff = new jsDiff();

var Editor = React.createClass({
    displayName: 'Editor',

    getInitialState: function(){
        return {
            content: ''
        };
    },
    emit: function(event, data){
        this.props.socket && this.props.socket.emit(event, data);
    },
    onEditorContentChanged: function(e) {
        var diff = jsDiff.diff_main(this.state.content, e.target.value, true);
        if (diff.length > 2)
            jsDiff.diff_cleanupSemantic(diff);

        var patch_list = jsDiff.patch_make(this.state.content, e.target.value, diff);
        var patch = jsDiff.patch_toText(patch_list);

        this.emit('editor', patch);

        this.setState({
            content: e.target.value
        });
    },
    onReceiveEditorPatch: function(patch){
        var patches = jsDiff.patch_fromText(patch);
        var results = jsDiff.patch_apply(patches, this.state.content);

        this.setState({
           content:  results[0]
        });
    },
    componentDidMount: function(){
        this.props.socket && this.props.socket.on('editor', this.onReceiveEditorPatch)
    },
    render: function() {
        return (
            <textarea onChange={this.onEditorContentChanged} value={this.state.content}></textarea>
        );
    }
});

module.exports = Editor;