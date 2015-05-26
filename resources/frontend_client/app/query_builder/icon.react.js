'use strict';

var Icon = React.createClass({
    displayName: 'Icon',
    propTypes: function () {

    },
    iconPaths: {
        check: 'M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z ',
        close: 'M4 8 L8 4 L16 12 L24 4 L28 8 L20 16 L28 24 L24 28 L16 20 L8 28 L4 24 L12 16 z ',

    },
    getDefaultProps: function () {
       return {
          width: 32,
          height: 32,
          fill: 'currentcolor',
          iconClassName: 'Icon'
       };
    },
    render: function () {
        return (
            <svg viewBox="0 0 32 32" {... this.props}>
                <path d={this.iconPaths[this.props.name]}/>
            </svg>
        );
    }
});
