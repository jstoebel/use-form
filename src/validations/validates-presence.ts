export default (message: string = 'value is required') => {
  return (value: string) => value ? null : message
}