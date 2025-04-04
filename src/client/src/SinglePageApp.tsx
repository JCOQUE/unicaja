import React, { useState } from 'react';
import { Container, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useInsight } from '@semoss/sdk-react';

const SinglePageApp = () => {
    const { actions } = useInsight();
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async () => {
        setLoading(true);
        setError('');
        setResponse('');

        try {
            const call = `LLM(engine="a2fd4e83-33da-4392-8e0d-6a8debdaa058", command=["<encode>${question}</encode>"])`;

            const LLMresponse = await actions.run<[{ response: string }]>(
                call,
            );

            const { output: LLMOutput, operationType: LLMOperationType } =
                LLMresponse.pixelReturn[0];

            if (LLMOperationType.indexOf('ERROR') > -1) {
                throw new Error(LLMOutput.response);
            }

            let conclusion = '';
            if (LLMOutput.response) {
                conclusion = LLMOutput.response;
            }
            // set answer based on data
            setResponse(conclusion);
        } catch (e: any) {
            setError(e.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Askjl the LLM
            </Typography>
            <TextField
                label="Your Question"
                variant="outlined"
                fullWidth
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAsk} disabled={loading}>
                Ask
            </Button>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {response && (
                <Typography variant="body1" marginTop="20px">
                    {response}
                </Typography>
            )}
        </Container>
    );
};

export default SinglePageApp;