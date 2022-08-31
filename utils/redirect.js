export const redirectToSignIn = () => {
  return redirectTo('/auth/signin');
}
export const redirectToHome = () => {
return redirectTo('/');
}
const redirectTo = (path) => {
  return {
    redirect: {
      destination: path,
      permanent: true,
    },
  };
}
