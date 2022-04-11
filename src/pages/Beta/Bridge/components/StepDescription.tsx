import React from 'react'
import { ReactChild } from "react";
import { Text } from '@pangolindex/components'

export default function StepDescription({
  children,
}: {
  children: ReactChild;
}) {
  return (
    <Text fontSize={15} fontWeight={300} lineHeight="15px" color="white" paddingBottom="20px">
      {children}
    </Text>
  );
}
