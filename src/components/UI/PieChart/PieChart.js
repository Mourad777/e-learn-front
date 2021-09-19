import React from "react";
import { connect } from "react-redux";
import { ResponsivePie } from "@nivo/pie";

const MyResponsivePie = ({ data, width, testForm,isDarkTheme }) => {
  let marginStyle = {
    top: width > 450 ? 0 : -200,
    right: 110,
    bottom: width > 450 ? 0 : -200,
    left: 110,
  };
  if (testForm)
    marginStyle = {
      top: width > 450 ? 50 : -150,
      right:  width > 450 ? 130 :70,
      bottom: width > 450 ? 50 : -150,
      left:  width > 450 ? 130 :70,
    };
  return (
    <ResponsivePie
      data={data}
      margin={marginStyle}
      innerRadius={0}
      padAngle={0.7}
      cornerRadius={3}
      colors={{ scheme: "category10" }}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", "0.2"]] }}
      radialLabelsSkipAngle={10}
      radialLabelsTextXOffset={0}
      // radialLabelsTextColor="#333333"
      radialLabelsLinkOffset={-10}
      radialLabelsLinkDiagonalLength={15}
      radialLabelsLinkHorizontalLength={3}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: "color" }}
      enableSlicesLabels={false}
      slicesLabelsSkipAngle={3}
      slicesLabelsTextColor="#333333"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      
      theme={isDarkTheme ? {
        textColor: 'white',labels:{text:{fill:'white'}}, background: '#424242', tooltip: {chip:{color:'white'}, basic: { background: "#424242" }, container: { background: "#424242" } }
      } : {}}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    width: state.common.width,
    isDarkTheme:state.common.isDarkTheme,
  };
};

export default connect(mapStateToProps)(MyResponsivePie);
