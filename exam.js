const welcome = {
  N: {
    I: "import tensorflow as tf;from tensorflow.keras.models import Sequential;from tensorflow.keras.layers import Dense, Conv2D, Dropout, Flatten, MaxPooling2D;from sklearn.preprocessing import LabelEncoder;from sklearn.model_selection import train_test_split",
    P: "Sep X,Y;le = LabelEncoder();leY = le.fit_transform(y);Y = pd.get_dummies(leY).values;X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=0);model = Sequential([Dense(10, activation='relu'),Dense(10, activation='relu'),Dense(3, activation='softmax')]);model.compile(optimizer='rmsprop',loss='categorical_crossentropy',metrics=['accuracy']);model.fit(X_train, y_train, batch_size=50, epochs=100);loss, accuracy = model.evaluate(X_test, y_test, verbose=0);y_pred = model.predict(X_test);actual = np.argmax(y_test,axis=1);predicted = np.argmax(y_pred,axis=1)",
  },
  C: {
    I: "from sklearn.preprocessing import StandardScaler;from sklearn.model_selection import train_test_split;from sklearn.svm import SVC;from sklearn.metrics import classification_report, confusion_matrix, accuracy_score;from sklearn.neighbors import KNeighborsClassifier;from sklearn.naive_bayes import GaussianNB;from sklearn.tree import DecisionTreeClassifier",
    P: "sns.heatmap(df.isnull());If num and non-num (separate);Get dummies of non-num;Apply SC on num;sc=StandardScaler();data_numerical.iloc[:,1:]=sc.fit_transform(data_numerical.iloc[:,1:]);Sep x,y;X_train,X_test,y_train,y_test =train_test_split(x,y,test_size=0.2,random_state=30);Method1;svclassifier=SVC(kernel='linear');svclassifier.fit(X_train,y_train);pred_1=svclassifier.predict(X_test);print(confusion_matrix(y_test,pred_1));print(classification_report(y_test,pred_1));print(accuracy_score(y_test,pred_1));Method2;knn = KNeighborsClassifier();knn.fit(X_train, y_train);pred_2=knn.predict(X_test);Print same metrics with pred_2;Method3;clf = GaussianNB();clf.fit(X_train, y_train);pred_3=clf.predict(X_test);Print same metrics with pred_3;Method4;dtree = DecisionTreeClassifier(random_state=0);tree = dtree.fit(X_train, y_train);pred_4=tree.predict(X_test);Print same metrics with pred_3;",
  },
  H: {
    I: "import pandas as pd;import numpy as np;import matplotlib.pyplot as plt;import seaborn as sns",
    U: "from google.colab import files;data_to_load=files.upload()",
  },
};
