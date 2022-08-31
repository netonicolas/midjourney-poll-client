export const date = {
  format: (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }
}
