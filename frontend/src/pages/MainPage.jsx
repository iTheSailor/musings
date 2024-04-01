import React from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  List,
  Image,
  Segment,
} from "semantic-ui-react";

const MainPage = () => (
  <>
    <Container style={{ height: "26rem" }}></Container>

    <Segment style={{ padding: "8em 0em" }} vertical>
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={8}>
            <Header
              as="h3"
              style={{ fontSize: "2em" }}
              content="Skillset"
            ></Header>
            <List horizontal
                style={{ fontSize: "1.33em" }}
            >
                <List.Item >Python</List.Item>
                <List.Item >Postgres</List.Item>
                <List.Item >JavaScript</List.Item>
                <List.Item >React</List.Item>
                <List.Item >Redux</List.Item>
            </List>
            <Header
              as="h3"
              style={{ fontSize: "2em" }}
              content="Professional Interests"
            ></Header>
            <List horizontal

                style={{ fontSize: "1.33em" }}
            >
                <List.Item >Full Stack Development</List.Item>
                <List.Item >Data Science</List.Item>
                <List.Item >Machine Learning</List.Item>
                <List.Item >Artificial Intelligence</List.Item>
            </List>
            <List>

                <List.Item >Cloud Computing</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column floated="right" width={6}>
            <Image
              bordered
              rounded
              size="large"
              src="/images/wireframe/white-image.png"
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column textAlign="center">
            <Button size="huge">Check Them Out</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: "0em" }} vertical>
      <Grid celled="internally" columns="equal" stackable>
        <Grid.Row textAlign="center">
          <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              What a Company
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              That is what they all say about us
            </p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              I shouldnt have gone with their competitor.
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              <Image avatar src="/images/avatar/large/nan.jpg" />
              <b>Nan</b> Chief Fun Officer Acme Toys
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: "8em 0em" }} vertical>
      <Container text>
        <Header as="h3" style={{ fontSize: "2em" }}>
          Breaking The Grid, Grabs Your Attention
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          Instead of on content creation and hard work, we have learned how to
          master the art of doing nothing by providing massive amounts of
          whitespace and generic content that can seem massive, monolithic and
          worth your attention.
        </p>
        <Button as="a" size="large">
          Read More
        </Button>

        <Divider
          as="h4"
          className="header"
          horizontal
          style={{ margin: "3em 0em", textTransform: "uppercase" }}
        ></Divider>

        <Header as="h3" style={{ fontSize: "2em" }}>
          Did We Tell You About Our Bananas?
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          Yes I know you probably disregarded the earlier boasts as non-sequitur
          filler content, but its really true. It took years of gene splicing
          and combinatory DNA research, but our bananas can really dance.
        </p>
        <Button as="a" size="large">
          Im Still Quite Interested
        </Button>
      </Container>
    </Segment>
  </>
);

export default MainPage;
