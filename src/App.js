import { useState } from 'react';
import Container from '@mui/material/Container';
import './App.css';
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

function App() {
  const [data, setData] = useState(
    JSON.parse(window.localStorage.getItem('data')) ?? []
  );
  const [prompt, setPrompt] = useState();
  const [loading, setLoading] = useState(false);
  const engines = [
    'text-curie-001',
    'text-babbage-001',
    'text-ada-001',
    'text-davinci-002',
  ];
  const [engine, setEngine] = useState(engines[0]);
  const url = `https://api.openai.com/v1/engines/${engine}/completions`;

  const handleEngineChange = ({ target: { value } }) => {
    setEngine(value);
  };
  const handlePromptChange = ({ target: { value } }) => setPrompt(value);

  const fetchData = () => {
    const fetchBody = {
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };
    setLoading(true);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_OPEN_API_KEY}`,
      },
      body: JSON.stringify(fetchBody),
    })
      .then((response) => response.json())
      .then((_data) => {
        const newData = [
          { prompt, response: _data.choices?.[0].text },
          ...data,
        ];
        setData(newData);
        window.localStorage.setItem('data', JSON.stringify(newData));
        setLoading(false);
      });
  };

  return (
    <Container
      maxWidth="md"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '2rem 1rem',
        gap: '1rem',
      }}
    >
      <Typography variant="h3" style={{ fontWeight: 'bold' }}>
        Fun with AI
      </Typography>
      <TextField
        value={prompt}
        label={'Enter prompt'}
        onChange={handlePromptChange}
        style={{ width: '100%' }}
        inputProps={{ resize: 'vertical' }}
        multiline
        minRows={6}
      />
      <Grid
        container
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '0 1rem' }}
      >
        <TextField
          select
          label="Select an engine"
          value={engine}
          onChange={handleEngineChange}
        >
          {engines.map((engine, index) => (
            <MenuItem value={engine} index={index}>
              {engine}
            </MenuItem>
          ))}
        </TextField>
        {loading ? (
          <Button disabled size={'large'} variant="contained">
            Loading
          </Button>
        ) : (
          <Button
            onClick={() => fetchData()}
            size={'large'}
            variant="contained"
          >
            Request
          </Button>
        )}
      </Grid>
      <Typography variant="h4" style={{ fontWeight: 'bold' }}>
        Responses
      </Typography>
      {data?.length ? (
        data.map(({ prompt, response }) => (
          <Card sx={{ width: '100%', padding: '0.25rem 0 0 0 ' }}>
            <CardContent>
              <Grid container>
                <Grid item xs="12" md="2">
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    fontWeight={'bold'}
                  >
                    Prompt:
                  </Typography>
                </Grid>
                <Grid item xs="12" md="10">
                  <Typography gutterBottom variant="h6" component="div">
                    {prompt}
                  </Typography>
                </Grid>
                <Grid item xs="12" md="2">
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    fontWeight={'bold'}
                  >
                    Response:
                  </Typography>
                </Grid>
                <Grid item xs="12" md="10">
                  <Typography gutterBottom variant="h6" component="div">
                    {response}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      ) : (
        <div>No responses recorded so far</div>
      )}
    </Container>
  );
}

export default App;
