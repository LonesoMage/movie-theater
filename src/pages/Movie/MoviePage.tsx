import styled from 'styled-components';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
  color: #f8fafc;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const MoviePage = () => {
  return (
    <Container>
      <h1>Movie Details</h1>
      <p>Movie details page coming soon!</p>
    </Container>
  );
};