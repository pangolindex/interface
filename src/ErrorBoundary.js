
import React from "react";
import { Text } from "@pangolindex/components"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text fontSize={15} fontWeight={200} lineHeight="20px" color="avaxRed" >
          An unexpected error has occurred. Please refresh the page.
        </Text>
      );
    }

    return this.props.children;
  }
}
