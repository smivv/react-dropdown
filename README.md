# React dropdown selector

This is the simplest dropdown selector which provides grouping and multiple selection.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

What you need to do

```
git clone https://github.com/smivv/react-dropdown
npm install
npm start
```

## Screenshots

### Select Box Example

![Select Box Example](https://user-images.githubusercontent.com/17829173/32392714-b929b7ba-c0e7-11e7-9035-94dc5176db96.png)

### Multiple Select Box Example

![Multiple Select Box Example](https://user-images.githubusercontent.com/17829173/32392610-652fde46-c0e7-11e7-9cf6-5e553309df9a.png)

### Select Box Example with Separated Groups

![Select Box Example with Separated Groups](https://user-images.githubusercontent.com/17829173/32392712-b9047bc6-c0e7-11e7-9f28-dc28f7c3a3a5.png)

### Multiple Select Box Example with Separated Groups

![alt text](https://user-images.githubusercontent.com/17829173/32392619-696d6b04-c0e7-11e7-9d3a-631026217a23.png)

### Usage Example

Code could be found in src/index.js

```
import React from 'react';
import ReactDOM from 'react-dom';
import SelectBox from './lib/select-box';

export default class Example extends React.Component{

    state = {
        color: null,
        colors: [],
        color2: null,
        colors2: []
    };

    handleChange(color) {
        this.setState({ color: color })
    };
    handleMultiChange(colors) {
        this.setState({ colors: colors })
    };

    handleChange2(color) {
        this.setState({ color2: color })
    };
    handleMultiChange2(colors) {
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
                    <option value="">No selected</option>
                    <option value="red" radioGroup="Colors">Red</option>
                    <option value="dark" radioGroup="Shades">Dark</option>
                    <option value="blue" radioGroup="Colors">Blue</option>
                    <option value="black" radioGroup="Colors">Black</option>
                    <option value="light" radioGroup="Shades">Light</option>
                </SelectBox>
                <h1>Multiple Select Box Example</h1>
                <SelectBox label="Favorite Color"
                           className="my-example-select-box"
                           multiple="true"
                           onChange={(e) => this.handleMultiChange(e)}
                           value={this.state.colors}>
                    <option value="">No selected</option>
                    <option value="red" radioGroup="Colors">Red</option>
                    <option value="dark" radioGroup="Shades">Dark</option>
                    <option value="blue" radioGroup="Colors">Blue</option>
                    <option value="black" radioGroup="Colors">Black</option>
                    <option value="light" radioGroup="Shades">Light</option>
                </SelectBox>
                <h1>Select Box Example with Separated Groups</h1>
                <SelectBox label="Favorite Color"
                           className="my-example-select-box"
                           separatedGroups="true"
                           onChange={(e) => this.handleChange2(e)}
                           value={this.state.color2}>
                    <option value="">No selected</option>
                    <option value="red" radioGroup="Colors">Red</option>
                    <option value="dark" radioGroup="Shades">Dark</option>
                    <option value="blue" radioGroup="Colors">Blue</option>
                    <option value="black" radioGroup="Colors">Black</option>
                    <option value="light" radioGroup="Shades">Light</option>
                </SelectBox>
                <h1>Multiple Select Box Example with Separated Groups</h1>
                <SelectBox label="Favorite Color"
                           className="my-example-select-box"
                           multiple="true"
                           separatedGroups="true"
                           onChange={(e) => this.handleMultiChange2(e)}
                           value={this.state.colors2}>
                    <option value="">No selected</option>
                    <option value="red" radioGroup="Colors">Red</option>
                    <option value="dark" radioGroup="Shades">Dark</option>
                    <option value="blue" radioGroup="Colors">Blue</option>
                    <option value="black" radioGroup="Colors">Black</option>
                    <option value="light" radioGroup="Shades">Light</option>
                </SelectBox>
            </div>
        );
    };
}

ReactDOM.render(<Example />, document.getElementById('root'));

```

## Built With

* [React](https://github.com/facebook/react) - The web framework used

## Authors

* **Vladimir Smirnov** - *Initial work* - [smivv](https://github.com/smivv)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
