var React = require('react');
var ReactDOM = require('react-dom');

var idInc = 0;

var keyHandlers = {
    37: 'handleLeftKey',
    38: 'handleUpKey',
    39: 'handleRightKey',
    40: 'handleDownKey',
    32: 'handleSpaceKey',
    13: 'handleEnterKey',
    27: 'handleEscKey',
    74: 'handleDownKey',
    75: 'handleUpKey'
};

export default class SelectBox extends React.Component{

    state = {
        id: 'react-select-box-' + (++idInc),
        open: false,
        focusedOption: -1,
        focusedGroup: 0,
        pendingValue: [],
        displayName: 'exports',
        clickingOption: false,
        blurTimeout: null
    };

    changeOnClose() {
        return this.isMultiple() && String(this.props.changeOnClose) === 'true';
    };

    updatePendingValue(value, callback) {
        if(this.changeOnClose()){
            this.setState({pendingValue: value}, callback);
            return true;
        }
        return false;
    };

    componentWillMount() {
        this.updatePendingValue(this.props.value);
    };

    componentWillReceiveProps(props) {
        this.updatePendingValue(props.value);
    };

    interceptEvent(event) {
        if(event){
            console.log(event.keyCode);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    handleFocus() {
        clearTimeout(this.blurTimeout);
    };

    handleBlur() {
        clearTimeout(this.blurTimeout);
        this.blurTimeout = setTimeout((e) => this.handleClose(e), 0);
    };

    handleMouseDown() {
        this.clickingOption = true;
    };

    handleChange(val, callback){
        return function(event){
            this.clickingOption = false;
            this.interceptEvent(event);
            if (this.isMultiple()) {
                var selected = [];
                if (val != null) {
                    selected = this.value().slice(0);
                    var index = selected.indexOf(val);
                    if (index !== -1) {
                        selected.splice(index, 1);
                    } else {
                        selected.push(val);
                    }
                }
                this.updatePendingValue(selected, callback) || this.props.onChange(selected);
            } else {
                this.updatePendingValue(val, callback) || this.props.onChange(val);
                this.handleClose();
                ReactDOM.findDOMNode(this.refs.button).focus();
            }
        }.bind(this);
    };

    handleGroupChange(val, callback){
        return function(event){
            this.clickingOption = false;
            this.interceptEvent(event);
            this.setState({focusedGroup: this.groupNames().indexOf(val)});
        }.bind(this);
    };

    handleNativeChange(event) {
        var val = event.target.value;
        if (this.isMultiple()) {
            var children = [].slice.call(event.target.childNodes, 0);
            val = children.reduce(function (memo, child) {
                if (child.selected) {
                    memo.push(child.value);
                }
                return memo;
            }, []);
        }
        this.props.onChange(val);
    };

    handleClear(event) {
        this.interceptEvent(event);
        this.handleChange(null, function () {
            // only called when change="true"
            this.props.onChange(this.state.pendingValue);
        })(event);
    };

    toggleOpenClose(event) {
        this.interceptEvent(event);
        this.setState({open: !this.state.open});
        if (this.state.open) {
            return this.setState({open: false});
        }
        this.handleOpen();
    };

    handleOpen(event) {
        this.interceptEvent(event);
        this.setState({open: true}, function () {
            ReactDOM.findDOMNode(this.refs.button).focus();
        });
    };

    handleClose(event) {
        this.interceptEvent(event);
        if (!this.clickingOption) {
            this.setState({open: false, focusedOption: -1});
        }
        if (this.changeOnClose()) {
            this.props.onChange(this.state.pendingValue);
        }
    };

    moveFocus(move) {
        var len;
        if(this.props.separatedGroups)
            len = this.groups()[this.state.focusedGroup].options.length;
        else
            len = React.Children.count(this.props.children);

        var idx = (this.state.focusedOption + move + len) % len;
        console.log('moveFocus', len, idx);
        this.setState({focusedOption: idx});
    };

    moveGroupFocus(move) {
        var len = this.groups().length;
        var idx = (this.state.focusedGroup + move + len) % len;
        console.log('moveGroupFocus', len, idx);
        this.setState({focusedGroup: idx, focusedOption: -1});
    };

    handleKeyDown(event) {
        if (keyHandlers[event.which]) {
            this[keyHandlers[event.which]](event);
        }
    };

    handleUpKey(event) {
        this.interceptEvent(event);
        this.moveFocus(-1);
    };

    handleLeftKey(event) {
        if(this.props.separatedGroups){
            this.interceptEvent(event);
            this.moveGroupFocus(-1);
        }
    };

    handleRightKey(event) {
        if(this.props.separatedGroups){
            this.interceptEvent(event);
            this.moveGroupFocus(1);
        }
    };

    handleDownKey(event) {
        this.interceptEvent(event);
        if (!this.state.open) {
            this.handleOpen(event);
        }
        this.moveFocus(1);
    };

    handleSpaceKey(event) {
        this.interceptEvent(event);
        if (!this.state.open) {
            this.handleOpen(event);
        } else if (this.state.focusedOption !== -1) {
            this.handleEnterKey();
        }
    };

    handleEnterKey(event) {
        if (this.state.focusedOption !== -1) {
            if(this.props.separatedGroups){
                this.handleChange(this.groups()[this.state.focusedGroup].options[this.state.focusedOption].value)(event);
            }else{
                this.handleChange(this.options()[this.state.focusedOption].value)(event);
            }
        }
    };

    handleEscKey(event) {
        if (this.state.open) {
            this.handleClose(event);
        } else {
            this.handleClear(event);
        }
    };

    label() {
        var selected = this.options()
            .filter(function (option) {
                return this.isSelected(option.value);
            }.bind(this))
            .map(function (option) {
                return option.label;
            });

        return this.props.hasLabel || !this.props.multiple ?
            (selected.length > 0 ? selected.join(', ') : this.props.label) : ((selected.length + ' option') + (selected.length !== 1 ? 's' : ''));
    };

    isMultiple() {
        return String(this.props.multiple) === 'true';
    };

    options() {
        var options = [];
        React.Children.forEach(this.props.children, function (option) {
            options.push({
                value: option.props.value,
                label: option.props.children,
                group: option.props.radioGroup
            });
        });
        return options.sort(function(a, b){
            if(a.group > b.group){
                return 1;
            }else if(a.group < b.group){
                return -1;
            }
            return 0;
        });
    };

    groups() {
        var groups = [];

        var hasGroup = function(groups, name) {
            for (var i = 0; i < groups.length; ++i) {
                if (groups[i].name === name)
                    return i;
            }
            return -1;
        };
        React.Children.forEach(this.props.children, function (option){
            var name = option.props.radioGroup;
            var i = hasGroup(groups, name);
            if(i === -1){
                i = groups.push({
                        name: option.props.radioGroup,
                        options: []
                    }) - 1;
            }
            groups[i].options.push({
                value: option.props.value,
                label: option.props.children,
                group: option.props.radioGroup
            });
        });

        var index = 0, i, j;
        if(!this.props.separatedGroups) {
            for (i = 0; i < groups.length; ++i) {
                for (j = 0; j < groups[i].options.length; ++j) {
                    groups[i].options[j].index = index++;
                }
            }
        }else{
            for (i = 0; i < groups.length; ++i) {
                for (j = 0; j < groups[i].options.length; ++j) {
                    groups[i].options[j].index = j;
                }
            }
        }
        return groups;
    };

    groupNames() {
        return this.groups().map((group, i) => {
            return group.name;
        });
    };

    value() {
        var value = this.changeOnClose() ?
            this.state.pendingValue :
            this.props.value;

        if (!this.isMultiple() || Array.isArray(value)) {
            return value;
        }
        if (value != null) {
            return [value];
        }
        return [];
    };

    hasValue() {
        if (this.isMultiple()) {
            return this.value().length > 0;
        }
        return this.value() != null;
    };

    isSelected(value) {
        if (this.isMultiple()) {
            return this.value().indexOf(value) !== -1;
        }
        return this.value() === value;
    };

    render() {
        var className = 'react-select-box-container';
        if (this.props.className) {
            className += ' ' + this.props.className;
        }
        if (this.isMultiple()) {
            className += ' react-select-box-multi';
        }
        if (!this.hasValue()) {
            className += ' react-select-box-empty';
        }
        return (
            <div onKeyDown={(e) => this.handleKeyDown(e)} className={className}>
                <button id={this.state.id} ref="button" className="react-select-box" onClick={(e) => this.toggleOpenClose(e)} onBlur={(e) => this.handleBlur(e)} tabIndex="0" aria-hidden="true">
                    <div className="react-select-box-label">
                        {this.label()}
                    </div>
                </button>
                {this.renderOptionMenu()}
                {this.renderClearButton()}
                {this.renderNativeSelect()}
            </div>
        );
    };

    renderOptionMenu() {
        var className = "";
        if (this.props.separatedGroups) {
            className += 'react-select-box-options-wide';
        }else{
            className += 'react-select-box-options';
        }
        if (!this.state.open) {
            className += ' react-select-box-hidden';
        }
        var groups = this.groups();
        var rendered = "";
        if(this.props.separatedGroups){
            rendered = (
                <div className="react-select-box-off-screen">
                    <div className="react-select-box-groups-header">
                        {groups.map((group, i) => this.renderGroupHeader(group, i))}
                    </div>
                    {this.renderGroup(groups[this.state.focusedGroup], this.state.focusedGroup)}
                </div>
            );
        }else{
            rendered = (
                <div className="react-select-box-off-screen">
                    {groups.map((group, i) => this.renderGroup(group, i))}
                </div>
            );
        }
        return (
            <div ref="menu"
                 className={className}
                 tabIndex="0"
                 aria-hidden="true"
                 onBlur={(e) => this.handleBlur(e)}
                 onFocus={(e) => this.handleFocus(e)}>
                {rendered}
                {this.renderCloseButton()}
            </div>
        );
    };

    renderGroupHeader(group, i) {
        var className = "react-select-box-group-name";
        if(i === this.state.focusedGroup)
            className += " react-select-box-group-name-selected";
        var name;
        if(typeof group.name !== 'undefined'){
            name = group.name;
        }else{
            name = "Undefined";
        }
        return (
            <a href="#"
               role="button"
               onClick = {(e) => this.handleGroupChange(group.name)(e)}
               onMouseDown = {(e) => this.handleMouseDown(e)}
               className={className}
               tabIndex = "-1"
               key = {name}
               onBlur = {(e) => this.handleBlur(e)}
               onFocus = {(e) => this.handleFocus(e)}>
                {name}
            </a>
        );
    };

    renderGroup(group, i) {
        if (this.props.separatedGroups) {
            return (
                <div className="react-select-box-group">
                    {group.options.map((option, j) => this.renderOption(option, i, j))}
                </div>
            );
        }else{
            var header = "";
            if(typeof group.name !== 'undefined'){
                header = (
                    <h3 className="react-select-box-group-header">
                        <span>
                            {group.name}
                        </span>
                    </h3>
                );
            }
            return (
                <div className="react-select-box-group">
                    {header}
                    {group.options.map((option, j) => this.renderOption(option, i, j))}
                </div>
            );
        }
    };

    renderOption(option, i, j){
        var className = 'react-select-box-option';
        if (option.index === this.state.focusedOption) {
            className += ' react-select-box-option-focused';
        }
        if (this.isSelected(option.value)) {
            console.log(option.value);
            className += ' react-select-box-option-selected';
        }
        return (
            <a id={this.state.id + '-' + i + '-' + j}
               href="#"
               role="button"
               onClick = {(e) => this.handleChange(option.value)(e)}
               onMouseDown = {(e) => this.handleMouseDown(e)}
               className = {className}
               tabIndex = "-1"
               key = {option.value}
               onBlur = {(e) => this.handleBlur(e)}
               onFocus = {(e) => this.handleFocus(e)}>
                {option.label}
            </a>
        );
    };

    renderNativeSelect() {
        var id = this.state.id + '-native-select';
        var multiple = this.isMultiple();
        var empty = multiple ? null : <option key="" value="">No selection</option>;
        var options = [empty].concat(this.props.children);
        console.log(multiple, this.props.value);
        return (
            <div className="react-select-box-native">
                <label htmlFor={id}>
                    {this.props.label}
                </label>
                <select id={id}
                        name={this.state.id + '-native-select[]'}
                        multiple={multiple}
                        onKeyDown={(e) => e.stopPropagation()}
                        value={this.props.value || (multiple ? [] : '')}
                        onChange={(e) => this.handleNativeChange(e)}>
                    {options}
                </select>
            </div>
        );
    };

    renderClearButton() {
        if (this.hasValue()) {
            return (
                <button aria-label={this.props.clearText}
                        className="react-select-box-clear"
                        onClick={(e) => this.handleClear(e)}>
                </button>
            );
        }
    };

    renderCloseButton() {
        if (this.isMultiple() && this.props.closeText) {
            return (
                <button className="react-select-box-close"
                        onClick={(e) => this.handleClose(e)}
                        onBlur={(e) => this.handleBlur(e)}
                        onFocus={(e) => this.handleFocus(e)}>
                    {this.props.closeText}
                </button>
            );
        }
    };
}