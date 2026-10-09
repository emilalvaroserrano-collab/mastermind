import { useCallback, useEffect, useState } from "react";
import { useStudent } from "@/lib/firebase-auth";
import { readLearnRemote, writeLearnRemote, authErrorMessage } from "@/lib/firebase";
import { emptyLearn, loadLearn, saveLearn, type LearnState } from "@/lib/learn";

function hasLocalWork(state: LearnState) {
  return state.name.length > 0 || state.enrolled.length > 0 || Object.keys(state.done).length > 0 || state.bookmarks.length > 0;
}

export function useLearn() {
  const { user, ready: authReady } = useStudent();
  const [state, setState] = useState<LearnState>(emptyLearn);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!authReady) return;
    let cancel = false;
    void (async () => {
      const local = loadLearn();
      if (!user) {
        if (!cancel) {
          setState(local);
          setReady(true);
        }
        return;
      }
      try {
        const remote = await readLearnRemote(user.uid);
        const next = remote ?? local;
        if (!remote && hasLocalWork(local)) await writeLearnRemote(user.uid, local);
        if (cancel) return;
        saveLearn(next);
        setState(next);
        setSaveError("");
      } catch (error) {
        if (!cancel) {
          setState(local);
          setSaveError(authErrorMessage(error));
        }
      } finally {
        if (!cancel) setReady(true);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [authReady, user]);

  const update = useCallback((change: (current: LearnState) => LearnState) => {
    setState((current) => {
      const next = change(current);
      saveLearn(next);
      const uid = user?.uid;
      if (uid) {
        void writeLearnRemote(uid, next).then(
          () => setSaveError(""),
          (error) => setSaveError(authErrorMessage(error)),
        );
      }
      return next;
    });
  }, [user]);

  return { state, ready: ready && authReady, update, saveError, signedIn: Boolean(user) };
}
