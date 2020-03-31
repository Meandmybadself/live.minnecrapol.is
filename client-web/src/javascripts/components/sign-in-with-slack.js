import React from 'react'

const SignInWithSlack = () => {
  return (
    <a className="sign-in-with-slack" href="https://slack.com/oauth/authorize?scope=identity.basic,identity.avatar&client_id=3364554065.1020069085329">
      <img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" />
    </a>
  )
}

export default SignInWithSlack