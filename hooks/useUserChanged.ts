import { useEffect } from 'react'
import firebase from '../firebaseConfig'
import { useRouter } from 'next/router'
import Cookie from 'universal-cookie'

export let unSubMeta: () => void

export const useUserChanged = () => {
  const cookie = new Cookie()
  const router = useRouter()
  const HASURA_TOKEN_KEY = 'https://hasura.io/jwt/claims'

  useEffect(() => {
    //新規userの作成や新規のログイン処理=> onAuthStateChanged
    const unSubUser = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        //tokenの取得+customclaimが既に設定されているかを判定
        const token = await user.getIdToken(true)
        const idTokenResult = await user.getIdTokenResult()
        const hasuraClaims = idTokenResult.claims[HASURA_TOKEN_KEY]
        if (hasuraClaims) {
          //既に設定されていた場合はcookieにセットしてリダイレクトする
          cookie.set('token', token, { path: '/' })
          router.push('/tasks')
        } else {
          //設定されていないときはサブスクリプションで設定されるのを監視
          const userRef = firebase
            .firestore()
            .collection('user_meta')
            .doc(user.uid)
          unSubMeta = userRef.onSnapshot(async () => {
            const tokenSnap = await user.getIdToken(true)
            const idTokenResultSnap = await user.getIdTokenResult()
            const hasuraClaimsSnap = idTokenResultSnap.claims[HASURA_TOKEN_KEY]
            if (hasuraClaimsSnap) {
              cookie.set('token', tokenSnap, { path: '/' })
              router.push('/tasks')
            }
          })
        }
      }
    })
    return () => {
      unSubUser()
    }
  }, [])

  return {}
}
