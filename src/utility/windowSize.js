// import { useLayoutEffect, useState } from "react";
// import { connect } from "react-redux";
// import { throttle } from "throttle-debounce";
// import { change } from "redux-form";
// const UseWindowSize = ({dimensions, changeDimensions}) => {
//   const [size, setSize] = useState([0, 0]);

//   function handleUpdateSize() {
//     changeDimensions([window.innerWidth, window.innerHeight]);
//   }

//   useLayoutEffect(() => {
//     window.addEventListener(
//       "resize",
//       throttle(
//         150,
//         false,
//         () => {
//           handleUpdateSize();
//         },
//         false
//       )
//     );
//     handleUpdateSize();
//     console.log("removeListener", removeListener);
//     // if(removeListener)window.removeEventListener("resize", handleUpdateSize);
//     return () => window.removeEventListener("resize", handleUpdateSize);
//   }, []);

//   return size;
// };

// // export function ShowWindowDimensions(removeListener) {
// //   console.log("removeListener", removeListener);
// //   const [width, height] = UseWindowSize(removeListener);
// //   return { width, height };
// // }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     changeDimensions: (dimensions) => {
//       dispatch(actions.changeDimensions(dimensions));
//     },
//   };
// };

// const mapStateToProps = (state) => {
//   return {
//     error: state.authentication.error,
//   };
// };

// export default connect(null, mapDispatchToProps)(UseWindowSize);
