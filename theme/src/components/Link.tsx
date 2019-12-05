import React from 'react'
import { navigate } from 'gatsby'
import { LocationContext } from './Layout'
import { Link as RawLink, LinkProps } from '@committed/components'

const isExternal = (url: string) => url && url.startsWith('http')
const isInPage = (url: string) => url && url.startsWith('#')
const isRelative = (url: string) => url && !url.startsWith('/')

const LocalLink: React.FC<LinkProps> = ({
  href,
  variant,
  ...props
}: LinkProps) => (
  <LocationContext.Consumer>
    {({ prefix, pathname }) => {
      let base = pathname
      // account for pathname including prefix
      if (prefix !== '/' && pathname.startsWith(prefix)) {
        base = pathname.substring(prefix.length)
      }
      let to = href
      if (isInPage(href)) {
        to = base + href
      } else if (isRelative(href)) {
        to = base.replace(/\/[^\/]*$/, `/${href}`)
      } else if (prefix !== '/' && href.startsWith(prefix)) {
        to = href.substring(prefix.length)
      }

      return (
        <RawLink variant={variant} onClick={() => navigate(to)} {...props} />
      )
    }}
  </LocationContext.Consumer>
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
//Link.contextType = LocationContext

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
