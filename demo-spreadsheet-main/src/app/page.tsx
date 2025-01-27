"use client";
import "@copilotkit/react-ui/styles.css";

import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import SingleSpreadsheet from "./components/SingleSpreadsheet";
import {
  CopilotKit,
  useCopilotAction,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { INSTRUCTIONS } from "./instructions";
import { canonicalSpreadsheetData } from "./utils/canonicalSpreadsheetData";
import { SpreadsheetData } from "./types";
import { PreviewSpreadsheetChanges } from "./components/PreviewSpreadsheetChanges";

const HomePage = () => {
  return (
    <CopilotKit
      publicApiKey=""
      // Alternatively, you can use runtimeUrl to host your own CopilotKit Runtime
      // runtimeUrl="/api/copilotkit"
      transcribeAudioUrl="/api/transcribe"
      textToSpeechUrl="/api/tts"
    >
      <CopilotSidebar
        instructions={INSTRUCTIONS}
        labels={{
          initial: "Welcome to the spreadsheet app! How can I help you?",
        }}
        defaultOpen={true}
        clickOutsideToClose={false}
      >
        <Main />
      </CopilotSidebar>
    </CopilotKit>
  );
};

const Main = () => {
  const [spreadsheets, setSpreadsheets] = React.useState<SpreadsheetData[]>([
    {
      title: "Spreadsheet 1",
      rows: [
        [{ value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }],
      ],
    },
  ]);

  const [selectedSpreadsheetIndex, setSelectedSpreadsheetIndex] = useState(0);

  const [itemList, setItemList] = useState<string[]>([]);

  useCopilotAction({
    name: "attemptToAddItemToGroceryList",
    description:
      "This action will attempt to add an item to the grocery list. It will sometimes fail to add.",
    parameters: [
      {
        name: "item",
        type: "string",
        description: "The item to add to groceryList",
      },
    ],
    handler: ({ item }) => {
      const randomListOfItems = [
        "oranges",
        "bananas",
        "milk",
        "bread",
        "eggs",
        "butter",
        "cheese",
        "yogurt",
        "chicken",
        "beef",
        "pork",
        "fish",
        "lettuce",
        "tomatoes",
        "onions",
        "potatoes",
        "onions",
        "potatoes",
        "carrots",
        "apples",
        "oranges",
        "bananas",
      ];
      const randomItem =
        randomListOfItems[Math.floor(Math.random() * randomListOfItems.length)];

      const shouldSucceed = Math.random() < 0.5;
      if (shouldSucceed) {
        setItemList((prevList) => [...prevList, item]);
        console.log("Copilot logged value:", itemList);
      } else {
        console.log("Copilot failed to add item:", item);
      }
    },
  });

  useEffect(() => {
    console.log("addItemToGroceryList", itemList);
  }, [itemList]);

  useCopilotReadable(
    {
      description: "Current state of the groceryList",
      value: itemList.join(", "),
    },
    [itemList]
  );

  // useCopilotAction({
  //   name: "createSpreadsheet",
  //   description: "Create a new  spreadsheet",
  //   parameters: [
  //     {
  //       name: "rows",
  //       type: "object[]",
  //       description: "The rows of the spreadsheet",
  //       attributes: [
  //         {
  //           name: "cells",
  //           type: "object[]",
  //           description: "The cells of the row",
  //           attributes: [
  //             {
  //               name: "value",
  //               type: "string",
  //               description: "The value of the cell",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: "title",
  //       type: "string",
  //       description: "The title of the spreadsheet",
  //     },
  //   ],
  //   render: (props) => {
  //     const { rows, title } = props.args;
  //     const newRows = canonicalSpreadsheetData(rows);

  //     return (
  //       <PreviewSpreadsheetChanges
  //         preCommitTitle="Create spreadsheet"
  //         postCommitTitle="Spreadsheet created"
  //         newRows={newRows}
  //         commit={(rows) => {
  //           const newSpreadsheet: SpreadsheetData = {
  //             title: title || "Untitled Spreadsheet",
  //             rows: rows,
  //           };
  //           setSpreadsheets((prev) => [...prev, newSpreadsheet]);
  //           setSelectedSpreadsheetIndex(spreadsheets.length);
  //         }}
  //       />
  //     );
  //   },
  //   handler: ({ rows, title }) => {
  //     // Do nothing.
  //     // The preview component will optionally handle committing the changes.
  //   },
  // });

  // useCopilotAction({
  //   name: "logValue",
  //   description: "Log a value to the console",
  //   parameters: [
  //     {
  //       name: "value",
  //       type: "string",
  //       description: "The value to log to the console",
  //     },
  //   ],
  //   handler: ({ value }) => {
  //     console.log("Copilot logged value:", value);
  //     return `Logged value: ${value}`;
  //   },
  // });

  // useCopilotReadable({
  //   description: "Today's date",
  //   value: new Date().toLocaleDateString(),
  // });

  return (
    <div className="flex">
      <Sidebar
        spreadsheets={spreadsheets}
        selectedSpreadsheetIndex={selectedSpreadsheetIndex}
        setSelectedSpreadsheetIndex={setSelectedSpreadsheetIndex}
      />
      <SingleSpreadsheet
        spreadsheet={spreadsheets[selectedSpreadsheetIndex]}
        setSpreadsheet={(spreadsheet) => {
          setSpreadsheets((prev) => {
            console.log("setSpreadsheet", spreadsheet);
            const newSpreadsheets = [...prev];
            newSpreadsheets[selectedSpreadsheetIndex] = spreadsheet;
            return newSpreadsheets;
          });
        }}
      />
    </div>
  );
};

export default HomePage;
