export const redirectToSignIn = () => {
  return redirectTo('/auth/signin');
}
export const redirectToHome = () => {
return redirectTo('/');
}
export const redirectToIsClose = () =>{
  return redirectTo('/error/isClose');
}
export const redirectToNotOpen = () =>{
  return redirectTo('/error/notOpen');
}
const redirectTo = (path) => {
  return {
    redirect: {
      destination: path,
      permanent: true,
    },
  };
}
