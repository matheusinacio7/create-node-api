export default function handleError(err: Error) {
  console.log(err.message);
  process.exit(-1);
}
