import { isPlaceholder, type Text } from './content'

/** Renders a piece of content, or a clearly marked placeholder if Lorenzo hasn't supplied it yet. */
export function Fact({ value }: { value: Text }) {
  if (isPlaceholder(value)) {
    return (
      <span className="wb-placeholder" data-placeholder>
        {value.needs}
      </span>
    )
  }
  return <>{value}</>
}
