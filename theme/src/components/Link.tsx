import React from 'react'
import escapeStringRegexp from 'escape-string-regexp'
import { withPrefix } from 'gatsby'
import { DocsContext } from './Layout'
import { Link as RawLink, LinkProps } from '@committed/components'

const pathStartRegEx = new RegExp(`^${escapeStringRegexp(withPrefix(`/`))}`)
const isExternal = (url: string) => url && url.startsWith('http')
const isInPage = (url: string) => url && url.startsWith('#')
const isRelative = (url: string) => url && !url.startsWith('/')

const LocalLink: React.FC<LinkProps> = ({
  href,
  variant,
  ...props
}: LinkProps) => (
  <DocsContext.Consumer>
    {({ pathname, navigate }) => {
      let base = pathname.replace(pathStartRegEx, `/`)

      let to = href
      if (isInPage(href)) {
        to = base + href
      } else if (isRelative(href)) {
        to = base.replace(/\/[^\/]*$/, `/${href}`)
      } else {
        to = href.replace(pathStartRegEx, `/`)
      }
      return (
        <RawLink
          variant={variant}
          onClick={() => navigate(to.toLowerCase())}
          {...props}
        />
      )
    }}
  </DocsContext.Consumer>
)

export const Link: React.FC<LinkProps> = ({ href, ...props }: LinkProps) => {
  if (isExternal(href)) {
    return <RawLink variant="styled" href={href} target="_blank" {...props} />
  }
  if (props.className && props.className.includes('gatsby-resp-image-link')) {
    return <RawLink variant="clear" href={href} target="_blank" {...props} />
  }
  if (props.className && props.className.includes('autolink')) {
    // Do not show the generated header links
    return null
  }
  return <LocalLink {...props} variant="styled" href={href} />
}

export const ClearLink: React.FC<LinkProps> = ({
  href,
  ...props
}: LinkProps) => {
  if (isExternal(href)) {
    return <RawLink variant="clear" href={href} target="_blank" {...props} />
  } else {
    return <LocalLink {...props} variant="clear" href={href} />
  }
}
