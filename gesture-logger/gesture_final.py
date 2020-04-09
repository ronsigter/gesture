import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn import preprocessing
from sklearn import metrics
from joblib import dump, load


data_path = './datasets/concatenated_data.csv'

class GestureClassifier:
  def __init__(self):
    sign_language = pd.read_csv(data_path)
    self.data = sign_language.iloc[:, 1:6].values
    self.le = preprocessing.LabelEncoder()
    self.target = self.le.fit_transform(sign_language.iloc[:, 0].values)
    self.target_names = list(dict.fromkeys(sign_language.iloc[:, 0].values))
    data_train, data_test, target_train, target_test = train_test_split(self.data, self.target, test_size=0.2, random_state=12)
    self.classifier = KNeighborsClassifier(n_neighbors = 5)
    self.classifier.fit(data_train, target_train)

  def predict(self, external_input_sample):
    prediction_raw_values = self.classifier.predict(external_input_sample)
    prediction_resolved_values = [self.target_names[p] for p in prediction_raw_values]
    return list(self.le.inverse_transform(prediction_raw_values))

# Using GestureClassifier
external_input_sample = [[308, 293, 514, 486, 406], [279,297,380,483,400]]
gesture_classifier = GestureClassifier()

prediction = gesture_classifier.predict(external_input_sample)
print("Prediction for {0} => \n{1}".format(external_input_sample, prediction))
