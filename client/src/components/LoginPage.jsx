import {
    Authenticator,
    Flex,
    Grid,
    Image,
    useTheme,
    View,
    Text
  } from "@aws-amplify/ui-react";
  import { Typography } from "@mui/material";
  
  export function Login() {
    const { tokens } = useTheme();
  const theme = {
    name: 'Auth Example Theme',
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay['10']}`,
            borderWidth: '0',
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: tokens.colors.blue['60'],
          },
          link: {
            color: tokens.colors.neutral['80'],
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px ${tokens.colors.blue['60']}`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.blue['60'],
            _active: {
              borderColor: tokens.colors.blue['100'],
              color: tokens.colors.neutral['100'],
            },
          },
        },
      },
    },
  }

  const components = {
    Header() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          {/* <Image
            alt="Amplify logo"
            src="https://docs.amplify.aws/assets/logo-dark.svg"
          /> */}
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2vw, 2.25rem)"
            color="primary"
          >
            SceneScout.iooo
        </Typography>
        </View>
      );
    },
  
    Footer() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.neutral[80]}>
            &copy; All Rights Reserved
          </Text>
          {/* <Text color={tokens.colors.neutral[80]}>
            In Loving Memory of The Best Fat Man, Kylo
          </Text> */}
        </View>
      );
    }
  };
  
  return (
    <Grid templateColumns={{ base: "1fr 0", medium: "1fr 1fr" }}>
        <Flex
            backgroundColor={tokens.colors.background.secondary}
            justifyContent="center"
        >
            <Authenticator components={components}>
                {/* Authentication components */}
            </Authenticator>
        </Flex>
        <View height="100vh">
            <Image
                src="https://images.unsplash.com/photo-1495954222046-2c427ecb546d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1600&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29tcHV0ZXJzfHx8fHx8MTYzNzE5MzE2MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900"
                width="100%"
                height="100%"
                objectFit="cover"
            />
        </View>
    </Grid>
);
  }

  export default Login;
