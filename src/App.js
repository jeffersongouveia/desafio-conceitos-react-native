import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import api from './services/api'

export default function App() {
  const [repos, setRepos] = useState([])

  function getRepositories() {
    api.get('repositories')
      .then(({ data }) => setRepos(data))
      .catch(console.error)
  }

  useEffect(getRepositories, [])

  async function handleLikeRepository(id) {
    await api.post(`repositories/${id}/like`, {}).catch(console.error)

    const reposUpdated = repos.map((repo) => {
      if (repo.id === id) {
        repo.likes += 1
      }

      return repo
    })

    setRepos(reposUpdated)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={repos}
          keyExtractor={repos => repos.id}
          renderItem={({ item: repo }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>
                {repo.title}
              </Text>

              <View style={styles.techsContainer}>
                {repo.techs.map((tech) => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repo.id}`}
                >
                  {repo.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repo.id)}
                testID={`like-button-${repo.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159C1',
  },

  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#FFF',
    padding: 20,
  },

  repository: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04D361',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#FFF',
  },

  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },

  button: {
    marginTop: 10,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#FFF',
    backgroundColor: '#7159C1',
    padding: 15,
  },
})
