import React from "react";
import styled from "styled-components";
import { CheckmarkIcon, XmarkIcon } from "./components/icons";
import "./App.css";
import Canvas from "./Canvas";

const Side = styled.section`
  flex: 1;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  padding: 0px 10px;
  font-size: 24px;
  margin-top: 50px;
`;

const Center = styled.section`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 100%;
  margin: 0px 20px;
`;

const FeedbackButton = styled.button`
  border: none;
  margin: 0px 10px;
  width: ${(props: { width?: number }) => props.width || 50}px;
  aspect-ratio: 1;
  color: white;
  border-radius: 5px;
`;
const PositiveFeedbackButton = styled(FeedbackButton)`
  background-color: green;
`;
const NegativeFeedbackButton = styled(FeedbackButton)`
  background-color: red;
`;

const InstructionsContainer = styled.div``;

function App() {
  return (
    <div className="App">
      <Side>
        <InstructionsContainer>
          <h1>Instructions</h1>
          <ol>
            <li>
              Draw a <strong>single</strong> digit on the canvas
            </li>
            <li>Hit the "Recognize" button below</li>
            <li>See the prediction on the right</li>
          </ol>
          <p>
            *Help train this neural network by pressing{" "}
            <PositiveFeedbackButton width={30} disabled>
              <CheckmarkIcon />
            </PositiveFeedbackButton>
            or
            <NegativeFeedbackButton width={30} disabled>
              <XmarkIcon />
            </NegativeFeedbackButton>
            .
          </p>
        </InstructionsContainer>
      </Side>

      <Center>
        <Canvas />
      </Center>

      <Side>
        <PredictionOutputContainer>
          <h1>It's a...</h1>
          <PredictionText id="prediction"></PredictionText>
          <FeedbackButtonsContainer>
            <PositiveFeedbackButton id="pos-feedback-btn">
              <CheckmarkIcon width={30} height={30} />
            </PositiveFeedbackButton>
            <NegativeFeedbackButton id="neg-feedback-btn">
              <XmarkIcon width={30} />
            </NegativeFeedbackButton>
          </FeedbackButtonsContainer>
          <CorrectionContainer>
            <label>Should be:</label>
            <CorrectionInput
              id="correction-input"
              placeholder="digit"
              maxLength={1}
            />
            <PositiveFeedbackButton width={30} id="pos-feedback-btn-correction">
              <CheckmarkIcon />
            </PositiveFeedbackButton>
          </CorrectionContainer>
        </PredictionOutputContainer>
      </Side>
    </div>
  );
}

const PredictionOutputContainer = styled.div`
  display: none;
  flex-flow: column nowrap;
  align-items: center;
`;

const PredictionText = styled.p`
  font-size: 120px;
`;

const FeedbackButtonsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const CorrectionContainer = styled.div`
  display: none;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const CorrectionInput = styled.input`
  margin: 0px 5px;
`;
export default App;
