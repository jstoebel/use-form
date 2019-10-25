export default () => {
  return (value: string) => value ? null : 'value is required'
}