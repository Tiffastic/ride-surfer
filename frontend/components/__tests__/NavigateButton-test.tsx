import "react-native";
import React from "react";
import NavigateButton from "../NavigateButton";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer
    .create(<NavigateButton dest="Salt Lake City, UT" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
