var React = require("react/addons");
var DataRow = require('./datarow.jsx');

var DataGrid = React.createClass({
  render: function() {
    var rows = [];
    var that = this;
    this.props.hero.forEach(function( h, index) {
      rows.push(<DataRow hero={h} key={h.name} onRowSelected={that.props.onRowSelected}/>);
    });
    return (
      /*
      <table className="table">
      <thead>
      <tr>
      <th>Name</th>
      <th>ID</th>
      </tr>
      </thead>
      <tbody>{rows}</tbody>
      </table>
      */
      <div className="container-fluid">
        {rows}
        
      </div>
    );
  }
});
module.exports = DataGrid;
