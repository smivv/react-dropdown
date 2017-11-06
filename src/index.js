import React from 'react';
import ReactDOM from 'react-dom';
import SelectBox from './lib/select-box';

class Example extends React.Component{

    state = {
        color: null,
        colors: [],
        color2: null,
        colors2: []
    };

    handleChange(color) {
        console.log(color);
        this.setState({ color: color })
    };
    handleMultiChange(colors) {
        console.log(colors);
        this.setState({ colors: colors })
    };

    handleChange2(color) {
        console.log(color);
        this.setState({ color2: color })
    };
    handleMultiChange2(colors) {
        console.log(colors);
        this.setState({ colors2: colors })
    };
    render() {
        return (
            <div className="example">
                <h1>Select Box Example</h1>
                <SelectBox label="Favorite Color"
                           className="my-example-select-box"
                           onChange={(e) => this.handleChange(e)}
                           value={this.state.color}>
                    <option key="1" value="">No selected</option>
                    <option key="2" value="red" radioGroup="Colors">Red</option>
                    <option key="3" value="dark" radioGroup="Shades">Dark</option>
                    <option key="4" value="blue" radioGroup="Colors">Blue</option>
                    <option key="5" value="black" radioGroup="Colors">Black</option>
                    <option key="6" value="light" radioGroup="Shades">Light</option>
                </SelectBox>
                <h1>Multiple Select Box Example</h1>
                <SelectBox label="Favorite Color"
                           className="my-example-select-box"
                           multiple="true"
                           onChange={(e) => this.handleMultiChange(e)}
                           value={this.state.colors}>
                    <option key="1" value="">No selected</option>
                    <option key="2" value="red" radioGroup="Colors">Red</option>
                    <option key="3" value="dark" radioGroup="Shades">Dark</option>
                    <option key="4" value="blue" radioGroup="Colors">Blue</option>
                    <option key="5" value="black" radioGroup="Colors">Black</option>
                    <option key="6" value="light" radioGroup="Shades">Light</option>
                </SelectBox>
                <h1>Select Box Example with Separated Groups</h1>
                <SelectBox label="Favorite Color"
                           className="my-example-select-box"
                           separatedGroups="true"
                           onChange={(e) => this.handleChange2(e)}
                           value={this.state.color2}>
                    <option key="1" value="">No selected</option>
                    <option key="2" value="red" radioGroup="Colors">Red</option>
                    <option key="3" value="dark" radioGroup="Shades">Dark</option>
                    <option key="4" value="blue" radioGroup="Colors">Blue</option>
                    <option key="5" value="black" radioGroup="Colors">Black</option>
                    <option key="6" value="light" radioGroup="Shades">Light</option>
                </SelectBox>
                <h1>Multiple Select Box Example with Separated Groups</h1>
                <SelectBox label="Favorite Color"
                           className="my-example-select-box"
                           multiple="true"
                           separatedGroups="true"
                           onChange={(e) => this.handleMultiChange2(e)}
                           value={this.state.colors2}>
                    <option key="1" value="">No selected</option>
                    <option key="2" value="red" radioGroup="Colors">Red</option>
                    <option key="3" value="dark" radioGroup="Shades">Dark</option>
                    <option key="4" value="blue" radioGroup="Colors">Blue</option>
                    <option key="5" value="black" radioGroup="Colors">Black</option>
                    <option key="6" value="light" radioGroup="Shades">Light</option>
                </SelectBox>
            </div>
        );
    };
}

ReactDOM.render(<Example />, document.getElementById('root'));
