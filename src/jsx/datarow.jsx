var React = require("react/addons");

var DataRow = React.createClass({
  //getInitialState: function() {
    //return { selected : false } ;
  //},
  handleClick: function() {
    //console.log( "handleClick");
    //this.setState({selected: !this.state.selected});
    this.props.onRowSelected( this );
  },
  render: function() {
    var id = this.props.hero.id;
    var cx = React.addons.classSet;
    var classes = cx({
        'highlight' : this.props.hero.selected,
        'xxx' : !this.props.hero.selected

    });
    return (
      <div className="col-sm-4 col-md-4 col-lg-4">
        <img src={this.props.hero.thumbnail.src} />
        <div> {this.props.hero.name} </div>
      </div>
      /*
      <tr onClick={this.handleClick} className={classes}>
      <td>{this.props.hero.name}</td>
      <td><img src={this.props.hero.thumbnail.src} />{this.props.hero.id}</td>
      </tr>
      */
    );
  }
});
module.exports = DataRow;
