import React from "react";
import { VStack, Container, HStack, IconButton, Icon, Text, Heading, List, ListItem } from "@chakra-ui/react";
import { MagikButton } from "@qfi/ui";
import { MdDashboard } from "react-icons/md";
import { HiCollection, HiQrcode } from "react-icons/hi";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

export const RecipientGuide = () => {
  return (
    <Container
      h="full"
      w="full"
      overflowY={"scroll"}
      right="-24px"
      top={0}
      left={0}
      position="absolute"
      sx={{
        scrollbarColor: "green",
        "::-webkit-scrollbar": {
          width: "0px",
        },

        "::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 0px grey",
          borderRadius: "0px",
        },

        "::-webkit-scrollbar-thumb": {
          background: "transparent",
          borderRadius: "0px",
        },
      }}>
      <VStack mt={20} spacing={10} h="full" alignItems="flex-start">
        <VStack spacing={6} alignItems="flex-start">
          <Heading size="4xl">Recipient Guide</Heading>
          <Text fontFamily={"archivo"}>
            Welcome! If you’re here, you’re probably working on something awesome in the Prague community - thanks for
            everything you do!
          </Text>
        </VStack>
        <VStack spacing={6} alignItems="flex-start">
          <Heading size="md">What is Quadratic Funding?</Heading>
          <Text fontFamily={"archivo"}>
            Quadratic Funding (QF) is a more democratic way for communities to decide how to allocate funds to public
            goods. A pool of matching funds is distributed among recipient projects according to a formula that takes
            into account both how many people value something, and the strength of people’s individual preferences.
          </Text>
          {/* <MagikButton /> */}
        </VStack>
        <VStack spacing={6} alignItems="flex-start">
          <Heading size="md">What does it mean to sign up as a recipient?</Heading>
          <Text fontFamily={"archivo"}>
            Adding your project makes you eligible to receive funds from the matching pool, but doesn’t guarantee
            funding. How much each project receives will be decided by ETHPrague attendees who vote during the event.
            You will need to be able to receive cryptocurrency (xDAI) in order to receive funds in the QF round; if
            you’re uncertain about this feel free to get in touch and we’ll be happy to help.
          </Text>
          <IconButton w={36} h={12} color="gray.800" icon={<Icon as={HiQrcode} boxSize={10} />} aria-label="Scan" />
        </VStack>
        <VStack spacing={6} alignItems="flex-start">
          <Heading size="md">Who should sign up?</Heading>
          <Text fontFamily={"archivo"}>
            We don’t have a lot of hard eligibility criteria, but your project should be a public good, often defined as
            non-rivalrous (use by one person doesn’tprevent access by others) and non-excludable (anyone can access or
            use it). It should also be:
          </Text>
          <List spacing={1} px={3}>
            <ListItem>
              <Text fontFamily={"archivo"}>• Local to Prague</Text>
            </ListItem>
            <ListItem>
              <Text fontFamily={"archivo"}>• Valuable to the Ethereum community</Text>
            </ListItem>
            <ListItem>
              <Text fontFamily={"archivo"}>• Not a scam</Text>
            </ListItem>
          </List>
          <IconButton
            w={36}
            h={12}
            color="gray.800"
            icon={<Icon as={HiCollection} boxSize={10} />}
            aria-label="Ballot"
          />
        </VStack>
        
      </VStack>
    </Container>
  );
};